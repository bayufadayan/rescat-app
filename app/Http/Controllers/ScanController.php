<?php

namespace App\Http\Controllers;

use App\Enums\ScanStatus;
use App\Models\ScanImage;
use App\Models\ScanResult;
use App\Models\ScanResultDetail;
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
    private const AREA_KEYS = ['left_eye', 'right_eye', 'mouth', 'left_ear', 'right_ear'];

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
        $session = ScanSession::with(['images', 'result.details'])->find($scan_session);

        if (!$session) {
            return response()->json([
                'ok'      => false,
                'code'    => 'SESSION_NOT_FOUND',
                'message' => 'Scan session tidak ditemukan.',
            ], 404);
        }

        $image = $session->images->first();

        if (!$image) {
            return response()->json([
                'ok'      => false,
                'code'    => 'SESSION_IMAGE_MISSING',
                'message' => 'Tidak ada image terkait session ini.',
            ], 400);
        }

        if ($session->status === ScanStatus::Done && $session->result && $session->result->details->isNotEmpty()) {
            return $this->buildProcessResponse($session);
        }

        try {
            $session->status = ScanStatus::Processing;
            $session->save();

            $removeBgData = $this->ensureRemoveBgImage($image);
            $result = $this->ensureScanResult($session);
            $landmarkData = $this->performLandmarkDetection($session, $image, $result);
            $classificationData = $this->performAreaClassification($result, $landmarkData['areas'] ?? []);

            $session->setRelation('result', $result->fresh('details'));
            $session->status = ScanStatus::Done;
            $session->save();

            return $this->buildProcessResponse($session, [
                'remove_bg' => $removeBgData,
                'landmark' => $landmarkData,
                'classification' => $classificationData,
            ]);
        } catch (\Throwable $e) {
            Log::error('processRemoveBg pipeline error: ' . $e->getMessage(), [
                'scan_session' => $scan_session,
                'trace'        => $e->getTraceAsString(),
            ]);

            $session->status = ScanStatus::Failed;
            $session->save();

            return response()->json([
                'ok'      => false,
                'code'    => 'PIPELINE_FAILED',
                'message' => $e->getMessage() ?: 'Terjadi kesalahan saat memproses sesi.',
            ], 500);
        }
    }

    public function processStatus(string $scan_session): JsonResponse
    {
        $session = ScanSession::with(['result.details'])->find($scan_session);

        if (!$session) {
            return response()->json([
                'ok'      => false,
                'message' => 'Scan session tidak ditemukan.',
            ], 404);
        }

        return $this->buildProcessResponse($session);
    }

    public function results(Request $request)
    {
        $sessionId = $request->query('session');

        if (!$sessionId) {
            abort(404, 'Scan session tidak ditemukan.');
        }

        $session = ScanSession::with(['images', 'result.details'])->findOrFail($sessionId);

        if ($session->user_id && $session->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('scan/scan-results', [
            'session' => $session,
            'result'  => $session->result,
        ]);
    }

    /**
     * Show results using path param `/scan/result/{scan_session}`
     */
    public function resultShow(string $scan_session)
    {
        $session = ScanSession::with(['images', 'result.details'])->findOrFail($scan_session);

        if ($session->user_id && $session->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('scan/scan-results', [
            'session' => $session,
            'result'  => $session->result,
        ]);
    }

    private function buildProcessResponse(ScanSession $session, array $extra = []): JsonResponse
    {
        $session->loadMissing(['images', 'result.details']);

        $statusValue = $session->status instanceof ScanStatus
            ? $session->status->value
            : $session->status;

        return response()->json([
            'ok'   => true,
            'data' => array_merge([
                'session' => [
                    'id'     => $session->id,
                    'status' => $statusValue,
                ],
                'images' => $session->images,
                'result' => $session->result,
            ], $extra),
        ]);
    }

    private function ensureScanResult(ScanSession $session): ScanResult
    {
        if ($session->result) {
            return $session->result;
        }

        $result = ScanResult::create([
            'scan_id' => $session->id,
            'remarks' => 'Sedang dianalisis',
        ]);

        $session->setRelation('result', $result);

        return $result;
    }

    private function ensureRemoveBgImage(ScanImage $image): array
    {
        if ($image->img_remove_bg_id && $image->img_remove_bg_url) {
            return [
                'id'     => $image->img_remove_bg_id,
                'url'    => $image->img_remove_bg_url,
                'bucket' => 'remove-bg',
                'cached' => true,
            ];
        }

        $sourceUrl = $image->img_original_url ?? $image->img_roi_url;

        if (!$sourceUrl) {
            throw new \RuntimeException('[REMOVE_BG] URL gambar original/ROI tidak tersedia.');
        }

        $data = $this->callFlask('/remove-bg', ['url' => $sourceUrl], 60, 'remove-bg');

        if (!($data['ok'] ?? false)) {
            throw new \RuntimeException('[REMOVE_BG] ' . ($data['message'] ?? 'Remove-bg gagal.'));
        }

        $removeBgId = $data['id'] ?? null;
        $removeBgUrl = $data['url'] ?? null;

        if (!$removeBgId || !$removeBgUrl) {
            throw new \RuntimeException('[REMOVE_BG] Response remove-bg tidak lengkap.');
        }

        $image->img_remove_bg_id = $removeBgId;
        $image->img_remove_bg_url = $removeBgUrl;
        $image->save();

        return [
            'id'     => $removeBgId,
            'url'    => $removeBgUrl,
            'bucket' => $data['bucket'] ?? 'remove-bg',
            'cached' => $data['cached'] ?? false,
        ];
    }

    private function performLandmarkDetection(ScanSession $session, ScanImage $image, ScanResult $result): array
    {
        $sourceUrl = $image->img_roi_url ?? $image->img_original_url;

        if (!$sourceUrl) {
            throw new \RuntimeException('[LANDMARK] URL gambar original/ROI tidak tersedia.');
        }

        $payload = $this->callFlask('/landmark', ['file' => $sourceUrl], 90, 'landmark');

        if (!($payload['ok'] ?? false)) {
            throw new \RuntimeException('[LANDMARK] ' . ($payload['message'] ?? 'Landmark detection gagal.'));
        }

        $result->img_landmark_id = data_get($payload, 'landmark.img_landmark_id');
        $result->img_landmark_url = data_get($payload, 'landmark.img_landmark_url');
        if (!$result->remarks) {
            $result->remarks = 'Sedang dianalisis';
        }
        $result->save();

        $areas = [];

        foreach (self::AREA_KEYS as $area) {
            $roiId = data_get($payload, "$area.img_{$area}_id");
            $roiUrl = data_get($payload, "$area.img_{$area}_url");

            if (!$roiId && !$roiUrl) {
                continue;
            }

            $detail = ScanResultDetail::updateOrCreate(
                ['scan_result_id' => $result->id, 'area_name' => $area],
                [
                    'img_roi_area_id'  => $roiId,
                    'img_roi_area_url' => $roiUrl,
                ]
            );

            $areas[$area] = [
                'detail_id' => $detail->id,
                'roi_id'    => $roiId,
                'roi_url'   => $roiUrl,
            ];
        }

        $session->setRelation('result', $result->fresh('details'));

        return [
            'ok'       => true,
            'landmark' => [
                'img_landmark_id'  => $result->img_landmark_id,
                'img_landmark_url' => $result->img_landmark_url,
            ],
            'areas'    => $areas,
        ];
    }

    private function performAreaClassification(ScanResult $result, array $areas): array
    {
        if (empty($areas)) {
            throw new \RuntimeException('[AREA_CHECK] Tidak ada area yang siap dianalisis.');
        }

        $payload = [];
        foreach ($areas as $area => $data) {
            if (!empty($data['roi_url'])) {
                $payload[$area] = $data['roi_url'];
            }
        }

        if (empty($payload)) {
            throw new \RuntimeException('[AREA_CHECK] URL area untuk klasifikasi tidak ditemukan.');
        }

        $body = $this->callFlask('/area-check', $payload, 120, 'area-check');

        if (!($body['ok'] ?? false)) {
            throw new \RuntimeException('[AREA_CHECK] ' . ($body['message'] ?? 'Area-check gagal.'));
        }

        $classification = $body['classification'] ?? [];
        $gradcam = $body['gradcam'] ?? [];

        foreach ($classification as $area => $cls) {
            $detail = ScanResultDetail::updateOrCreate(
                ['scan_result_id' => $result->id, 'area_name' => $area],
                []
            );

            $detail->confidence_score = isset($cls['confidence']) ? (float) $cls['confidence'] : null;
            $detail->label = $cls['label'] ?? null;

            $gradcamBlock = $gradcam[$area] ?? [];
            $detail->img_gradcam_id = $gradcamBlock["img_{$area}_gradcam_id"] ?? null;
            $detail->img_gradcam_url = $gradcamBlock["img_{$area}_gradcam_url"] ?? null;

            $detail->save();
        }

        $result->load('details');

        $abnormalCount = $result->details
            ? $result->details->filter(function (ScanResultDetail $detail) {
                return strcasecmp($detail->label ?? '', 'abnormal') === 0;
            })->count()
            : 0;

        $remarks = $this->determineRemarkFromAbnormal($abnormalCount);
        $result->remarks = $remarks;
        $result->save();

        return [
            'ok'             => true,
            'classification' => $classification,
            'gradcam'        => $gradcam,
            'summary'        => [
                'abnormal_count' => $abnormalCount,
                'remarks'        => $remarks,
            ],
        ];
    }

    private function callFlask(string $relativePath, array $payload, int $timeout, string $stage): array
    {
        if (str_starts_with($relativePath, 'http://') || str_starts_with($relativePath, 'https://')) {
            $endpoint = $relativePath;
        } else {
            $base = rtrim((string) env('FLASK_CAT_API_URL'), '/');
            $path = ltrim($relativePath, '/');

            // If base already ends with /v1/cat, don't add v1/cat prefix to path
            // If path starts with v1/cat/, strip it to avoid duplication
            if (str_ends_with($base, '/v1/cat')) {
                // Base sudah include /v1/cat, pastikan path tidak duplikat
                if (str_starts_with($path, 'v1/cat/')) {
                    $path = substr($path, 7);
                }
            }

            $endpoint = $base . '/' . $path;
        }

        Log::info("Flask {$stage} request", [
            'endpoint' => $endpoint,
            'payload_keys' => array_keys($payload),
        ]);

        try {
            $resp = Http::timeout($timeout)
                ->acceptJson()
                ->post($endpoint, $payload);
        } catch (\Throwable $e) {
            Log::warning("Flask {$stage} unreachable", [
                'endpoint' => $endpoint,
                'message'  => $e->getMessage(),
            ]);

            throw new \RuntimeException(sprintf('[%s] Service tidak dapat dijangkau.', strtoupper($stage)));
        }

        if (!$resp->ok()) {
            Log::warning("Flask {$stage} HTTP error", [
                'endpoint' => $endpoint,
                'status'   => $resp->status(),
                'body'     => $resp->body(),
            ]);

            throw new \RuntimeException(sprintf('[%s] Service mengembalikan status tidak valid (%s).', strtoupper($stage), $resp->status()));
        }

        $data = $resp->json();

        if (!is_array($data)) {
            throw new \RuntimeException(sprintf('[%s] Response tidak dapat diparsing.', strtoupper($stage)));
        }

        return $data;
    }

    private function determineRemarkFromAbnormal(int $abnormalCount): string
    {
        return match (true) {
            $abnormalCount === 0        => 'Sehat',
            $abnormalCount === 1        => 'Perlu perhatian ringan',
            $abnormalCount === 2,
            $abnormalCount === 3        => 'Perlu diperiksa',
            default                     => 'Tidak Sehat',
        };
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
