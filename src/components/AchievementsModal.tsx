import React from 'react';
import { loadAchievements } from '../utils/storage';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const achievements = loadAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completionPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-4 border-amber-500 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="wood-panel px-6 py-4 flex items-center justify-between border-b-4 border-amber-950 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎖️</span>
            <div>
              <h2 className="font-game font-black text-xl sm:text-2xl text-amber-100 drop-shadow-xs">
                Sistem Pencapaian
              </h2>
              <p className="text-xs text-amber-200">
                Kumpulkan penghargaan dan asah kemampuan berhitungmu!
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

        {/* Progress Bar Header */}
        <div className="p-4 bg-amber-50 dark:bg-slate-800 border-b border-amber-200 dark:border-slate-700 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Total Pencapaian Terbuka: <span className="text-amber-600 dark:text-amber-400 font-black">{unlockedCount}</span> / {achievements.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {completionPercent}% Terkumpul
            </div>
          </div>

          <div className="w-36 sm:w-48 h-3.5 bg-amber-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 border border-amber-300">
            <div
              className="h-full bg-linear-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-3 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                ach.unlocked
                  ? 'bg-amber-50 dark:bg-slate-800/90 border-amber-400 dark:border-amber-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                  ach.unlocked
                    ? 'bg-linear-to-br from-amber-300 to-amber-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale'
                }`}
              >
                {ach.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-game font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {ach.title}
                  </h4>
                  {ach.unlocked && (
                    <span className="text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.2 rounded-full shrink-0">
                      ✓ Selesai
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {ach.description}
                </p>

                {/* Progress bar */}
                {!ach.unlocked && (
                  <div className="mt-2">
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-right text-slate-400 mt-0.5 tabular-nums">
                      {ach.progress} / {ach.maxProgress}
                    </div>
                  </div>
                )}

                {/* Reward title */}
                {ach.rewardTitle && (
                  <div className="mt-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                    Gelar: &ldquo;{ach.rewardTitle}&rdquo;
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-50 dark:bg-slate-800 border-t border-amber-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
