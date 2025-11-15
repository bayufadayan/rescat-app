<?php

namespace App\Http\Controllers;

use App\Models\ScanImage;
use App\Models\ScanSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ScanController extends Controller
{
    public function index()
    {
        return redirect()->route('scan.options');
    }

    public function options()
    {
        return Inertia::render('scan/scan-options');
    }
    public function capture()
    {
        return Inertia::render('scan/scan-capture');
    }
    public function crop()
    {
        return Inertia::render('scan/scan-crop');
    }
    public function analyze(Request $request): JsonResponse
    {
        // 1) Validasi dengan mapping status & code yang konsisten dgn FE
        try {
            $request->validate([
                'file' => 'required|image|mimes:jpg,jpeg,png|max:512',
            ]);
        } catch (ValidationException $e) {
            $failed = $e->validator->failed();
            $code = 'INVALID_FILE';
            $status = 400;

            if (isset($failed['file']['Mimes'])) {
                $code = 'UNSUPPORTED_MEDIA_TYPE';
                $status = 415;
            } elseif (isset($failed['file']['Max'])) {
                $code = 'FILE_TOO_LARGE';
                $status = 413;
            } elseif (isset($failed['file']['Image'])) {
                $code = 'INVALID_FILE';
                $status = 400;
            } elseif (isset($failed['file']['Required'])) {
                $code = 'INVALID_FILE';
                $status = 400;
            }

            return response()->json([
                'ok' => false,
                'code' => $code,
                'message' => $this->errorMessageForCode($code),
            ], $status);
        }

        // 2) Panggil Flask
        $flaskUrl = rtrim(env('FLASK_CAT_API_URL'), '/') . '/recognize';
        $file = $request->file('file');

        try {
            $resp = Http::timeout(15)
                ->retry(1, 300)
                ->attach('file', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
                ->post($flaskUrl);

            $rid = $resp->header('X-Request-ID') ?? Str::lower(Str::random(8));
            $payload = $resp->json();

            if (is_null($payload)) {
                return response()->json([
                    'ok' => false,
                    'code' => 'INVALID_FLASK_RESPONSE',
                    'message' => 'Respons tidak valid dari server analisis.',
                ], 502);
            }

            // 3) Normalisasi jadi CatApiSuccessV1
            $out = $this->mapFlaskToCatApi($payload, $rid);

            // Untuk hasil konten (CAT/NON-CAT; 0/multi face), selalu 200
            return response()->json($out, 200)->withHeaders(['X-Request-ID' => $rid]);
        } catch (\Throwable $e) {
            Log::error('Analyze error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'ok' => false,
                'code' => 'FLASK_UNREACHABLE',
                'message' => 'Gagal terhubung ke server analisis.',
            ], 502);
        }
    }

    private function errorMessageForCode(string $code): string
    {
        return match ($code) {
            'FILE_TOO_LARGE' => 'Ukuran gambar terlalu besar.',
            'UNSUPPORTED_MEDIA_TYPE' => 'Format file tidak didukung.',
            'INVALID_FILE' => 'File tidak valid.',
            default => 'Terjadi kesalahan.',
        };
    }

    /**
     * Map JSON Flask → CatApiSuccessV1 (TS: scan.ts)
     */
    private function mapFlaskToCatApi(array $src, string $rid): array
    {
        $faces = $src['faces'] ?? null;

        // baca nested object (baru) + fallback lama
        $roiId = is_array($faces) ? ($faces['roi']['id'] ?? null) : null;
        $roiUrl = is_array($faces) ? ($faces['roi']['url'] ?? ($faces['roi_url'] ?? null)) : null;

        $previewId = is_array($faces) ? ($faces['preview']['id'] ?? null) : null;
        $previewUrl = is_array($faces) ? ($faces['preview']['url'] ?? ($faces['preview_url'] ?? null)) : null;

        $facesCount = is_array($faces) ? ($faces['faces_count'] ?? null) : null;
        $canProceed = ($facesCount === 1);

        $message = ($src['label'] ?? null) === 'NON-CAT'
            ? 'Bukan kucing.'
            : ($facesCount === 1
                ? 'Terdeteksi tepat 1 wajah kucing.'
                : (is_numeric($facesCount) && $facesCount > 1
                    ? 'Terdeteksi lebih dari satu wajah.'
                    : 'Tidak ada wajah kucing terdeteksi.'));

        return [
            'ok' => true,
            'request_id' => $src['request_id'] ?? $rid,
            'can_proceed' => $canProceed,
            'message' => $message,
            'image_url' => $roiUrl, // tetap

            'recognize' => [
                'label' => $src['label'] ?? 'NON-CAT',
                'cat_prob' => $src['cat_prob'] ?? 0.0,
                'threshold' => $src['threshold'] ?? 0.5,
                'topk' => $src['topk'] ?? [],
                'meta' => $src['meta'] ?? [],
            ],

            'faces' => $faces ? [
                'ok' => (bool)($faces['ok'] ?? false),
                'faces_count' => $faces['faces_count'] ?? null,
                'chosen_conf' => $faces['chosen_conf'] ?? null,
                'box' => $faces['box'] ?? null,
                'note' => $faces['note'] ?? null,
                'kept_confs_ge_min' => $faces['kept_confs_ge_min'] ?? [],
                'meta' => $faces['meta'] ?? [],

                // NEW (flat fields untuk FE)
                'preview_id' => $previewId,
                'preview_url' => $previewUrl,
                'roi_id' => $roiId,
                'roi_url' => $roiUrl,

                // nested (tetap ada kalau perlu)
                'preview' => $faces['preview'] ?? null,
                'roi' => $faces['roi'] ?? null,

                'roi_upload_error' => $faces['roi_upload_error'] ?? ($faces['roi_error'] ?? null),
                'error' => $faces['error'] ?? null,
            ] : null,

            'meta' => [
                'api_latency_ms' => (int)($src['meta']['api_latency_ms'] ?? 0),
            ],
        ];
    }

    public function details()
    {
        return Inertia::render('scan/scan-details');
    }

    public function storeSession(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'scan_type'        => 'required|string',
                'checkup_type'     => 'required|in:quick,detail',
                'latitude'         => 'nullable|numeric',
                'longitude'        => 'nullable|numeric',
                'location'         => 'nullable|string',
                'informer'         => 'nullable|string',
                'notes'            => 'nullable|string',
                'cat_id'           => 'nullable|string',
                'images.img_original_id'        => 'nullable|string',
                'images.img_original_url'       => 'nullable|url',
                'images.img_bounding_box_id'    => 'nullable|string',
                'images.img_bounding_box_url'   => 'nullable|url',
                'images.img_roi_id'             => 'nullable|string',
                'images.img_roi_url'            => 'nullable|url',
                'images.img_remove_bg_id'       => 'nullable|string',
                'images.img_remove_bg_url'      => 'nullable|url',
            ]);

            $session = ScanSession::create([
                'user_id'      => Auth::id(),
                'cat_id'       => $validated['cat_id'] ?? null,
                'scan_type'    => $validated['scan_type'],
                'checkup_type' => $validated['checkup_type'],
                'status'       => 'processing',
                'latitude'     => $validated['latitude'] ?? null,
                'longitude'    => $validated['longitude'] ?? null,
                'location'     => $validated['location'] ?? null,
                'informer'     => $validated['informer'] ?? null,
                'notes'        => $validated['notes'] ?? null,
            ]);

            $imgPayload = $validated['images'] ?? [];

            $img = ScanImage::create([
                'scan_id'                 => $session->id,
                'img_original_id'         => $imgPayload['img_original_id'] ?? null,
                'img_original_url'        => $imgPayload['img_original_url'] ?? null,
                'img_bounding_box_id'     => $imgPayload['img_bounding_box_id'] ?? null,
                'img_bounding_box_url'    => $imgPayload['img_bounding_box_url'] ?? null,
                'img_roi_id'              => $imgPayload['img_roi_id'] ?? null,
                'img_roi_url'             => $imgPayload['img_roi_url'] ?? null,
                'img_remove_bg_id'        => $imgPayload['img_remove_bg_id'] ?? null,
                'img_remove_bg_url'       => $imgPayload['img_remove_bg_url'] ?? null,
            ]);

            return response()->json([
                'ok' => true,
                'data' => [
                    'session_id' => $session->id,
                    'image_id'   => $img->id,
                ],
            ], 201);
        } catch (\Throwable $e) {
            Log::error("StoreSession error: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'ok' => false,
                'message' => 'Gagal membuat sesi. Silakan coba lagi.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function processIndex()
    {
        return redirect()->route('scan.details');
    }

    public function process(string $scan_session)
    {
        if (!$scan_session) {
            return redirect()->route('scan.details');
        }

        $session = ScanSession::with([
            'images',
        ])->find($scan_session);

        if (!$session) {
            return redirect()->route('scan.details');
        }

        return Inertia::render('scan/scan-process', [
            'session' => $session,
        ]);
    }

    public function processRemoveBg(Request $request, string $scan_session): JsonResponse
    {
        $session = ScanSession::with('images')->find($scan_session);

        if (!$session) {
            return response()->json([
                'ok'      => false,
                'message' => 'Scan session tidak ditemukan.',
            ], 404);
        }

        $image = $session->images->first();

        if (!$image) {
            return response()->json([
                'ok'      => false,
                'message' => 'Tidak ada image terkait session ini.',
            ], 400);
        }

        // 🔍 Sumber gambar: ORIGINAL (sesuai permintaan kamu)
        $sourceUrl = $image->img_original_url ?? $image->img_roi_url;

        if (!$sourceUrl) {
            return response()->json([
                'ok'      => false,
                'message' => 'URL gambar original/ROI tidak tersedia.',
            ], 400);
        }

        $flaskBase = rtrim(env('FLASK_CAT_API_URL'), '/'); // contoh: http://127.0.0.1:5000/v1/cat
        $endpoint  = $flaskBase . '/remove-bg';

        try {
            $resp = Http::timeout(60)
                ->acceptJson()
                ->post($endpoint, [
                    'url' => $sourceUrl,
                ]);

            if (!$resp->ok()) {
                return response()->json([
                    'ok'          => false,
                    'message'     => 'Gagal terhubung ke service remove-bg.',
                    'status_code' => $resp->status(),
                    'body'        => $resp->json(),
                ], 502);
            }

            $data = $resp->json();

            if (!($data['ok'] ?? false)) {
                return response()->json([
                    'ok'      => false,
                    'message' => $data['message'] ?? 'Remove-bg gagal di Flask.',
                    'error'   => $data,
                ], 502);
            }

            // Struktur dari Flask: ok, id, url, bucket, filename, hash, cached
            $removeBgId  = $data['id']  ?? null;
            $removeBgUrl = $data['url'] ?? null;

            if (!$removeBgId || !$removeBgUrl) {
                return response()->json([
                    'ok'      => false,
                    'message' => 'Response Flask tidak mengandung id/url.',
                    'error'   => $data,
                ], 502);
            }

            // Simpan ke DB
            $image->img_remove_bg_id  = $removeBgId;
            $image->img_remove_bg_url = $removeBgUrl;
            $image->save();

            return response()->json([
                'ok'   => true,
                'data' => [
                    'id'      => $removeBgId,
                    'url'     => $removeBgUrl,
                    'bucket'  => $data['bucket'] ?? 'remove-bg',
                    'cached'  => $data['cached'] ?? null,
                    'hash'    => $data['hash'] ?? null,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('processRemoveBg error: ' . $e->getMessage(), [
                'scan_session' => $scan_session,
                'source_url'   => $sourceUrl,
                'trace'        => $e->getTraceAsString(),
            ]);

            return response()->json([
                'ok'      => false,
                'message' => 'Terjadi kesalahan saat menghapus background.',
            ], 500);
        }
    }

    public function results()
    {
        return Inertia::render('scan/scan-results');
    }

    public function removebg()
    {
        return Inertia::render('scan/scan-removebg');
    }

    public function removebgServerPage()
    {
        return Inertia::render('scan/scan-removebg-server');
    }

    // proses remove BG via remove.bg API
    public function removeBgServerProcess(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);
        } catch (ValidationException $e) {
            $failed = $e->validator->failed();
            $code = 'INVALID_FILE';
            $status = 400;

            if (isset($failed['file']['Mimes'])) {
                $code = 'UNSUPPORTED_MEDIA_TYPE';
                $status = 415;
            } elseif (isset($failed['file']['Max'])) {
                $code = 'FILE_TOO_LARGE';
                $status = 413;
            } elseif (isset($failed['file']['Image'])) {
                $code = 'INVALID_FILE';
                $status = 400;
            } elseif (isset($failed['file']['Required'])) {
                $code = 'INVALID_FILE';
                $status = 400;
            }

            return response()->json([
                'ok' => false,
                'code' => $code,
                'message' => $this->errorMessageForCode($code),
            ], $status);
        }

        $file = $request->file('file');

        try {
            // 🔥 Panggil remove.bg via helper Laravel dari package
            // Ini akan mengirim file ke API remove.bg dan dapat PNG transparan balik
            $pngBinary = removebg()
                ->file($file->getRealPath())
                ->get(); // raw contents PNG

            return response($pngBinary, 200, [
                'Content-Type'        => 'image/png',
                'Content-Disposition' => 'inline; filename="removed-bg.png"',
            ]);
        } catch (\Throwable $e) {
            Log::error('RemoveBG API error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'ok' => false,
                'message' => 'Gagal menghapus background di server (remove.bg).',
            ], 500);
        }
    }
}
