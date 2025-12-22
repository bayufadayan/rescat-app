import React, { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { useRoute } from 'ziggy-js';
import OptionGroup from '@/components/scan/options/option-group';
import { OptionItem, OptionValue } from '@/components/scan/options/option-card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import ScanTypeModal, { ScanType } from '@/components/scan/options/scan-type-modal';
import BottomSheet from '@/components/scan/options/bottom-sheet';
import RestrictionModal from '@/components/scan/options/restriction-modal';
import { getScanPresetLabel, getSteps } from '@/constants/scan-steps';

const OPTIONS: OptionItem[] = [
  { value: 'face', title: 'Face only check-up', desc: 'Scan cepat untuk area wajah. Ideal untuk cek harian & ringkas.', icon: '/images/icon/face-only-icon.svg', selectedIcon: '/images/icon/face-only-icon-selected.svg' },
  { value: 'full', title: 'Full body check-up', desc: 'Pemeriksaan menyeluruh dari ujung kepala hingga kaki.', icon: '/images/icon/full-body-icon.svg', selectedIcon: '/images/icon/full-body-icon-selected.svg' },
];

export default function ScanOptions() {
  const route = useRoute();
  const [committedSelected, setCommittedSelected] = useLocalStorage<OptionValue | null>('scanOption', null);
  const [committedScanType, setCommittedScanType] = useLocalStorage<ScanType | null>('scanType', null);
  const [draftSelected, setDraftSelected] = useState<OptionValue | null>(null);
  const [draftScanType, setDraftScanType] = useState<ScanType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [restrictOpen, setRestrictOpen] = useState(false);
  const [restrictReason, setRestrictReason] = useState<'full' | 'face-detail' | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    setDraftSelected(committedSelected);
    setDraftScanType(committedScanType);
  }, [committedSelected, committedScanType]);

  const isRestricted = useMemo(() => {
    if (draftSelected === 'full') return true;
    if (draftSelected === 'face' && draftScanType === 'detail') return true;
    return false;
  }, [draftSelected, draftScanType]);

  const selectedTypeLabel = draftScanType === 'quick' ? 'Quick scan' : draftScanType === 'detail' ? 'Detail scan' : null;

  const handleSelectOption = (v: OptionValue) => {
    if (v === 'full') {
      setRestrictReason('full');
      setRestrictOpen(true);
      setDraftSelected(null);
      setDraftScanType(null);
      setModalOpen(false);
      return;
    }
    setDraftSelected(v);
    setDraftScanType(null);
    setModalOpen(true);
  };

  const handleConfirmType = (t: ScanType) => {
    if (draftSelected === 'face' && t === 'detail') {
      setRestrictReason('face-detail');
      setRestrictOpen(true);
      setModalOpen(false);
      return;
    }
    setDraftScanType(t);
    setModalOpen(false);
    
    // Langsung buka bottom sheet karena sudah pasti valid (draftSelected sudah ada, t adalah scanType yang baru)
    setTimeout(() => {
      setSheetOpen(true);
    }, 150);
  };

  const handleNext = () => {
    if (!draftSelected || !draftScanType) return;
    if (isRestricted) {
      setRestrictReason(draftSelected === 'full' ? 'full' : 'face-detail');
      setRestrictOpen(true);
      return;
    }
    setSheetOpen(true);
  };

  const handleStartScan = () => {
    if (!draftSelected || !draftScanType || isStarting) return;
    if (draftSelected === 'full') {
      setRestrictReason('full');
      setRestrictOpen(true);
      return;
    }
    if (draftSelected === 'face' && draftScanType === 'detail') {
      setRestrictReason('face-detail');
      setRestrictOpen(true);
      return;
    }
    
    setIsStarting(true);
    setCommittedSelected(draftSelected);
    setCommittedScanType(draftScanType);
    
    // Delay sedikit untuk menunjukkan loading state
    setTimeout(() => {
      const url = route('scan.capture');
      window.location.href = url;
    }, 300);
  };

  const presetLabel = useMemo(() => getScanPresetLabel(draftSelected, draftScanType), [draftSelected, draftScanType]);
  const stepItems = useMemo(() => getSteps(draftSelected, draftScanType), [draftSelected, draftScanType]);

  return (
    <AppLayout>
      <main className="min-h-dvh h-dvh flex flex-col items-center justify-between bg-[linear-gradient(to_bottom,_#0091F3,_#21A6FF)] relative">
        <div className="absolute w-full h-full bg-[url('/images/background/pink-purple.png')] bg-cover bg-center bg-no-repeat mix-blend-soft-light" />
        <div className="px-4 flex flex-col pt-22 items-center gap-4 w-full">
          <h1 className="font-semibold text-2xl text-white w-full text-center">Choose check-up type do you want to use</h1>
          <OptionGroup
            options={OPTIONS}
            value={draftSelected}
            onChange={handleSelectOption}
            ariaLabel="Check-up type selection"
            selectedTypeLabel={selectedTypeLabel}
          />
        </div>
        <div className="flex flex-col w-full gap-2 px-4 pb-8 items-center z-10">
          <Button
            type="button"
            className={['w-full py-5 transition-all max-w-lg', draftSelected && draftScanType ? 'bg-white text-black active:scale-95 duration-300 ease-in-out cursor-pointer' : 'bg-white/60 text-black/60 cursor-not-allowed backdrop-blur-2xl'].join(' ')}
            onClick={handleNext}
          >
            Oke, lanjut
          </Button>
          <Button
            type="button"
            onClick={() => (window.location.href = route('home'))}
            className="w-full border border-white/50 bg-white/10 text-white py-5 cursor-pointer max-w-lg backdrop-blur-2xl active:scale-95 transition-all duration-300 ease-in-out"
          >
            Back to Home
          </Button>
        </div>
      </main>

      <ScanTypeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmType}
        defaultValue={draftScanType}
      />

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div className="flex h-2 w-[100px] bg-gray-400/80 rounded-full mx-auto mb-3" />
        <h3 className="text-center text-lg font-semibold">Instruksi</h3>
        <div className="mt-3 flex flex-col gap-3">
          <label className="text-sm text-neutral-600">Preset</label>
          <select
            disabled
            value="current"
            className="w-full max-w-lg mx-auto rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 px-3 py-2 cursor-not-allowed"
          >
            <option value="current">{presetLabel}</option>
          </select>
          {stepItems.length === 0 ? (
            <p className="text-sm text-neutral-500">Langkah akan tampil setelah kamu memilih tipe scan.</p>
          ) : (
            <ol className="list-decimal pl-5 space-y-2 text-sm text-neutral-700">
              {stepItems.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
        </div>
        <div className="mt-5">
          <Button 
            type="button" 
            onClick={handleStartScan} 
            disabled={isStarting}
            className={`w-full py-5 font-semibold transition-all duration-200 ${isStarting ? 'bg-[#0a83da] cursor-wait' : 'bg-[#0091F3] hover:bg-[#0a83da]'} text-white`}
          >
            {isStarting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                Loading...
              </span>
            ) : (
              'Start Scan'
            )}
          </Button>
        </div>
      </BottomSheet>

      <RestrictionModal
        open={restrictOpen}
        onClose={() => setRestrictOpen(false)}
        title={restrictReason === 'full' ? 'Full Body belum tersedia' : 'Detail Scan untuk Face belum tersedia'}
        description={restrictReason === 'full' ? 'Fitur Full Body masih dalam pengembangan. Silakan gunakan Face only terlebih dahulu.' : 'Mode Detail untuk Face masih dalam pengembangan. Silakan pilih Quick scan.'}
        primaryText="Mengerti"
        onPrimary={() => setRestrictOpen(false)}
      />
    </AppLayout>
  );
}
