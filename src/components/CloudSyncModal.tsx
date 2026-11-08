import React, { useState } from 'react';
import { exportCloudSyncData, importCloudSyncData } from '../utils/storage';
import { sound } from '../utils/audio';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncSuccess
}) => {
  const [syncCode, setSyncCode] = useState('');
  const [importInput, setImportInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const handleGenerateCode = () => {
    const code = exportCloudSyncData();
    setSyncCode(code);
    setStatusMessage(null);
    sound.playClick();
  };

  const handleCopyCode = async () => {
    if (!syncCode) return;
    try {
      await navigator.clipboard.writeText(syncCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      sound.playCorrect();
    } catch {
      // fallback
    }
  };

  const handleImport = () => {
    if (!importInput.trim()) {
      setStatusMessage({ text: 'Mohon masukkan kode sinkronisasi terlebih dahulu!', isError: true });
      return;
    }
    const res = importCloudSyncData(importInput);
    if (res.success) {
      sound.playVictory();
      setStatusMessage({ text: res.message, isError: false });
      setTimeout(() => {
        onSyncSuccess();
        onClose();
      }, 1200);
    } else {
      sound.playWrong();
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border-4 border-amber-500 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="wood-panel px-6 py-4 flex items-center justify-between border-b-4 border-amber-950 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☁️</span>
            <div>
              <h2 className="font-game font-black text-xl text-amber-100 drop-shadow-xs">
                Sinkronisasi Cloud & Cadangan
              </h2>
              <p className="text-xs text-amber-200">
                Akses progres & pencapaianmu dari perangkat mana saja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-amber-900/80 hover:bg-amber-900 text-white flex items-center justify-center font-bold text-lg cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                statusMessage.isError
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-green-100 text-green-700 border border-green-300'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* SECTION 1: EXPORT / BACKUP */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-2.5">
            <h3 className="font-game font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>📤</span> Cadangkan Data dari Perangkat Ini
            </h3>
            <p className="text-xs text-slate-500">
              Buat kode cadangan unik untuk mentransfer skor, statistik harian, dan pencapaian ke HP atau laptop lain.
            </p>

            {!syncCode ? (
              <button
                type="button"
                onClick={handleGenerateCode}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-game font-bold text-sm rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                Buat Kode Sinkronisasi Cloud
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  readOnly
                  value={syncCode}
                  rows={3}
                  className="w-full p-2 text-xs font-mono bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-700 rounded-xl select-all break-all"
                />
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-game font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  {copied ? '✓ Kode Tersalin ke Clipboard!' : 'Salin Kode Sinkronisasi'}
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: IMPORT / RESTORE */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-2.5">
            <h3 className="font-game font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>📥</span> Pulihkan / Impor dari Perangkat Lain
            </h3>
            <p className="text-xs text-slate-500">
              Tempelkan kode sinkronisasi yang telah kamu salin dari perangkat sebelumnya.
            </p>

            <textarea
              value={importInput}
              onChange={e => setImportInput(e.target.value)}
              placeholder="Tempel kode sinkronisasi di sini..."
              rows={2}
              className="w-full p-2 text-xs font-mono bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-amber-500"
            />

            <button
              type="button"
              onClick={handleImport}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-game font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
            >
              Sinkronkan & Perbarui Data Progres
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-50 dark:bg-slate-800 border-t border-amber-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 text-slate-800 dark:text-slate-100 rounded-xl font-bold cursor-pointer transition-colors text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
