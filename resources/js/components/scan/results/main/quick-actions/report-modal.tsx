// src/components/scan/results/main/quick-actions/report-modal.tsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog';
import { BadgeCheck, Hash, FileText, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import type { ScanSessionPayload } from '@/types/scan-result';

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    session: ScanSessionPayload;
};

export default function ReportModal({ open, onOpenChange, session }: Props) {
    const [category, setCategory] = useState('kualitas_foto');
    const [reasons, setReasons] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [contact, setContact] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { auth } = usePage<any>().props;
    const isGuest = !auth?.user;

    const toggleReason = (val: string) =>
        setReasons(prev => (prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]));

    const onSubmit = async () => {
        setIsSubmitting(true);
        
        try {
            const response = await router.post('/api/checkup-reports', {
                scan_session_id: session.id,
                category,
                reasons,
                description: notes,
                contact,
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Tampilkan animasi sukses
                    setIsSuccess(true);
                    
                    // Tunggu 2 detik untuk animasi, lalu tutup modal
                    setTimeout(() => {
                        setIsSuccess(false);
                        setIsSubmitting(false);
                        onOpenChange(false);
                        // Reset form
                        setCategory('kualitas_foto');
                        setReasons([]);
                        setNotes('');
                        setContact('');
                    }, 2000);
                },
                onError: (errors) => {
                    console.error('Error submitting report:', errors);
                    setIsSubmitting(false);
                    
                    // Show user-friendly error message
                    const errorMessage = errors?.message || 
                        Object.values(errors || {}).flat().join(', ') || 
                        'Gagal mengirim laporan. Silakan coba lagi.';
                    
                    alert(errorMessage);
                },
            });
        } catch (error) {
            console.error('Error submitting report:', error);
            setIsSubmitting(false);
            alert('Gagal mengirim laporan. Silakan coba lagi.');
        }
    };

    // Get first image for preview
    const firstImage = session.images?.[0];
    const photoUrl = firstImage?.img_original_url || '/images/dummy/cat-original.png';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
          z-[120]
          sm:max-w-[640px]
          p-0
          overflow-hidden
          rounded-2xl
          my-6 sm:my-10
          max-h-[85dvh]
          bg-white
          flex flex-col
        "
            >
                {isSuccess ? (
                    // Success Animation
                    <div className="flex flex-col items-center justify-center py-16 px-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                            <CheckCircle2 className="h-20 w-20 text-emerald-500 relative z-10 animate-bounce" />
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-slate-900">
                            Laporan Berhasil Dikirim!
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 text-center">
                            Terima kasih atas laporannya. Tim kami akan segera meninjau.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header (fixed di atas) */}
                        <DialogHeader className="px-5 pt-5 pb-3 shrink-0">
                            <DialogTitle className="text-base font-semibold">
                                Buat Laporan Pemeriksaan
                            </DialogTitle>
                            <DialogDescription className="text-sm">
                                Tinjau ringkasan hasil di bawah, lalu jelaskan masalah yang ingin kamu laporkan.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Isi yang bisa discroll, dengan jarak atas & bawah yang lega */}
                        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-10 sm:pb-12 space-y-5" style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#a0aec0 transparent",
                        }}>
                            {/* Card ringkas */}
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                                    <img
                                        src={photoUrl}
                                        alt="Hasil pemeriksaan"
                                        className="h-full w-full object-cover"
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-900">
                                        Hasil Pemeriksaan {session.scan_type || 'Wajah'}
                                    </p>
                                    <p className="text-xs text-slate-600">
                                        Status:&nbsp;
                                        <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                                            session.status === 'done' 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {session.status === 'done' ? 'Selesai' : session.status}
                                        </span>
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                                        <Hash className="h-3.5 w-3.5" />
                                        {session.id}
                                    </p>
                                </div>
                                    </div>

                            {/* Kategori */}
                            <div className="grid gap-1.5">
                                <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Kategori Laporan
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={isSubmitting}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-sky-100 focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="kualitas_foto">Kualitas foto bermasalah</option>
                                    <option value="hasil_tidak_akurat">Hasil tidak akurat</option>
                                    <option value="identitas_salah">Identitas/ID salah</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>

                            {/* Alasan */}
                            <div className="grid gap-1.5">
                                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    Pilih Alasan (opsional)
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        ['blur', 'Foto blur'],
                                        ['gelap', 'Pencahayaan gelap'],
                                        ['framing', 'Framing kurang tepat'],
                                        ['misdetect', 'Deteksi salah'],
                                        ['server', 'Kesalahan server'],
                                    ].map(([val, label]) => (
                                        <label
                                            key={val}
                                            className={`cursor-pointer select-none rounded-full border px-3 py-1.5 text-xs ${reasons.includes(val)
                                                ? 'border-sky-300 bg-sky-50 text-sky-700'
                                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={reasons.includes(val)}
                                                onChange={() => toggleReason(val)}
                                                disabled={isSubmitting}
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="grid gap-1.5">
                                <label className="text-sm font-medium text-slate-800">Deskripsi Laporan</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    disabled={isSubmitting}
                                    placeholder="Jelaskan masalah yang kamu temui…"
                                    className="min-h-[110px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-sky-100 focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <p className="text-[11px] text-slate-500">
                                    Hindari membagikan informasi sensitif. Tim kami akan meninjau laporan ini.
                                </p>
                            </div>

                            {/* Kontak */}
                            <div className="grid gap-1.5">
                                <label className="text-sm font-medium text-slate-800">
                                    Kontak {isGuest && <span className="text-sky-600">(disarankan)</span>}
                                    {!isGuest && <span className="text-slate-500">(opsional)</span>}
                                </label>
                                <input
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    disabled={isSubmitting}
                                    placeholder="Email atau nomor WhatsApp"
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-sky-100 focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                {isGuest && (
                                    <p className="text-[11px] text-sky-600 flex items-start gap-1">
                                        <BadgeCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                        <span>
                                            Tinggalkan kontak agar tim kami dapat menghubungi Anda terkait laporan ini.
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer (fixed di bawah, dengan safe-area) */}
                        <div className="shrink-0 w-full bg-white/95 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)] backdrop-blur">
                            <div className="flex gap-2">
                                <DialogClose asChild>
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        className="w-1/3 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Tutup
                                    </button>
                                </DialogClose>

                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    disabled={isSubmitting}
                                    className="w-2/3 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 hover:brightness-[1.03] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <BadgeCheck className="h-4 w-4" />
                                            Kirim Laporan
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
