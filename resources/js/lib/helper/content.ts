export type ContentFile = {
    id: string;
    bucket: string;
    filename: string;
    originalName: string;
    mime: string;
    size: number;
    createdAt: number;
    url: string;
};

const CONTENT_API_BASE = 'https://storage.rescat.life/api';

export async function uploadToContent(
    file: File,
    bucket = 'original-photo',
): Promise<ContentFile> {
    const fd = new FormData();
    // urutan PENTING: bucket → file
    fd.append('bucket', bucket);
    fd.append('file', file, file.name);

    const res = await fetch(`${CONTENT_API_BASE}/files`, {
        method: 'POST',
        body: fd,
    });
    if (!res.ok) throw new Error(`UPLOAD_HTTP_${res.status}`);
    const json = (await res.json()) as {
        ok: boolean;
        data?: ContentFile;
        message?: string;
    };

    if (!json.ok || !json.data) {
        throw new Error(json.message || 'UPLOAD_FAILED');
    }
    return json.data;
}