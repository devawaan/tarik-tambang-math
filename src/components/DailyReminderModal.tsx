import React, { useState } from 'react';
import { loadUserStats, saveUserStats } from '../utils/storage';
import { sound } from '../utils/audio';

interface DailyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBonusClaimed?: (bonusScore: number) => void;
}

export const DailyReminderModal: React.FC<DailyReminderModalProps> = ({
  isOpen,
  onClose,
  onBonusClaimed
}) => {
  const [stats, setStats] = useState(loadUserStats());
  const [reminderTime, setReminderTime] = useState(stats.dailyReminderTime || '19:00');
  const [isEnabled, setIsEnabled] = useState(stats.dailyReminderEnabled ?? true);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleToggle = () => {
    const updated = !isEnabled;
    setIsEnabled(updated);
    const newStats = { ...stats, dailyReminderEnabled: updated };
    setStats(newStats);
    saveUserStats(newStats);
  };

  const handleTimeChange = (time: string) => {
    setReminderTime(time);
    const newStats = { ...stats, dailyReminderTime: time };
    setStats(newStats);
    saveUserStats(newStats);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('Tarik Tambang Matematika 🪢', {
          body: `Waktunya berlatih berhitung! Jaga streak ${stats.streakDays} harimu dan jadilah juara!`,
          icon: '/favicon.ico'
        });
        setTestSent(true);
        sound.playVictory();
      } else {
        alert('Izin notifikasi ditolak di browser. Anda tetap dapat mengaktifkan pengingat di aplikasi.');
      }
    } else {
      alert('Browser Anda belum mendukung web notification.');
    }
  };

  const handleClaimStreakBonus = () => {
    if (bonusClaimed) return;
    setBonusClaimed(true);
    sound.playVictory();
    if (onBonusClaimed) {
      onBonusClaimed(300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border-4 border-amber-500 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="wood-panel px-6 py-4 flex items-center justify-between border-b-4 border-amber-950 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            <div>
              <h2 className="font-game font-black text-xl text-amber-100 drop-shadow-xs">
                Notifikasi & Pengingat Latihan
              </h2>
              <p className="text-xs text-amber-200">
                Bangun kebiasaan konsisten berhitung tiap hari
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

        <div className="p-5 space-y-4">
          {/* DAILY STREAK CARD WITH BONUS CLAIM */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-amber-950 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-game font-bold text-xs uppercase tracking-wider block">
                  Streak Konsistensi
                </span>
                <span className="font-game font-black text-3xl">
                  🔥 {stats.streakDays} Hari Berturut-turut!
                </span>
              </div>
              <span className="text-4xl">🎁</span>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-950/20 flex items-center justify-between">
              <span className="text-xs font-semibold">Bonus Latihan Harian (+300 Poin)</span>
              <button
                type="button"
                disabled={bonusClaimed}
                onClick={handleClaimStreakBonus}
                className={`px-3 py-1.5 rounded-xl font-game font-black text-xs transition-all shadow-md cursor-pointer ${
                  bonusClaimed
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-amber-950 text-yellow-300 hover:bg-amber-900 active:scale-95'
                }`}
              >
                {bonusClaimed ? '✓ Diklaim!' : 'Klaim Sekarang'}
              </button>
            </div>
          </div>

          {/* Toggle Daily Reminder */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-game font-bold text-sm text-slate-800 dark:text-slate-100 block">
                Aktifkan Pengingat Harian
              </span>
              <span className="text-xs text-slate-500">
                Peringatan otomatis agar tidak putus streak
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                isEnabled ? 'bg-amber-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Set Time */}
          {isEnabled && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Waktu Pengingat Setiap Hari:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={reminderTime}
                  onChange={e => handleTimeChange(e.target.value)}
                  className="px-3 py-2 rounded-xl border-2 border-amber-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-game font-bold text-lg focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={requestNotificationPermission}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-game font-bold text-xs transition-colors cursor-pointer"
                >
                  {testSent ? '✓ Izin Aktif!' : 'Uji Notifikasi'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-50 dark:bg-slate-800 border-t border-amber-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
