import React from 'react';
import { loadUserStats } from '../utils/storage';

interface DailyStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyStatsModal: React.FC<DailyStatsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const stats = loadUserStats();

  const totalQuestions = stats.totalQuestions || 1;
  const overallAccuracy = Math.round((stats.totalCorrect / totalQuestions) * 100);
  const winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;
  const avgSpeedSec = (stats.averageResponseMs / 1000).toFixed(1);

  // Maximum questions in past 7 days for relative bar chart height
  const maxDayQuestions = Math.max(
    ...stats.dailyHistory.map(d => d.questionsSolved),
    10
  );

  const calcOpPercent = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-4 border-amber-500 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="wood-panel px-6 py-4 flex items-center justify-between border-b-4 border-amber-950 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="font-game font-black text-xl sm:text-2xl text-amber-100 drop-shadow-xs">
                Statistik Perkembangan Harian
              </h2>
              <p className="text-xs text-amber-200">
                Pantau peningkatan kecepatan dan akurasi berhitungmu
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

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* TOP 4 KEY METRICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Akurasi Rata-rata</span>
              <span className="font-game font-black text-2xl text-amber-600 dark:text-amber-400">
                {overallAccuracy}%
              </span>
              <span className="text-[10px] text-slate-400 block">{stats.totalCorrect} benar dari {stats.totalQuestions}</span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Kecepatan Jawab</span>
              <span className="font-game font-black text-2xl text-blue-600 dark:text-blue-400">
                {avgSpeedSec}s
              </span>
              <span className="text-[10px] text-slate-400 block">Detik per soal</span>
            </div>

            <div className="p-3 rounded-2xl bg-green-50 dark:bg-slate-800 border border-green-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Streak Harian</span>
              <span className="font-game font-black text-2xl text-green-600 dark:text-green-400">
                🔥 {stats.streakDays}
              </span>
              <span className="text-[10px] text-slate-400 block">Hari berturut-turut</span>
            </div>

            <div className="p-3 rounded-2xl bg-red-50 dark:bg-slate-800 border border-red-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Rasio Menang</span>
              <span className="font-game font-black text-2xl text-red-600 dark:text-red-400">
                {winRate}%
              </span>
              <span className="text-[10px] text-slate-400 block">{stats.totalWins} menang / {stats.totalGames} game</span>
            </div>
          </div>

          {/* 7-DAY VISUAL ACTIVITY BAR CHART */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 border-2 border-amber-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-game font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>📅</span> Tren Aktivitas 7 Hari Terakhir
              </h3>
              <span className="text-xs text-slate-500">Soal Diselesaikan / Hari</span>
            </div>

            <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2">
              {stats.dailyHistory.map(day => {
                const heightPercent = Math.max(12, Math.round((day.questionsSolved / maxDayQuestions) * 100));
                const dateLabel = new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' });

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip on hover */}
                    <div className="text-[10px] font-bold text-amber-900 dark:text-amber-300 mb-1 opacity-80 group-hover:opacity-100 tabular-nums">
                      {day.questionsSolved}
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[36px] bg-amber-200 dark:bg-slate-700 rounded-t-lg overflow-hidden flex flex-col justify-end">
                      <div
                        className="w-full bg-linear-to-t from-amber-600 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 rounded-t-lg transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Day Name */}
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-2 capitalize">
                      {dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAILED OPERATION BREAKDOWN (+, -, ×, ÷) */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 border-2 border-amber-200 dark:border-slate-700">
            <h3 className="font-game font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
              <span>🧮</span> Analisis Ketepatan per Operasi Matematika
            </h3>

            <div className="space-y-3">
              {[
                {
                  label: 'Penjumlahan (+)',
                  icon: '➕',
                  data: stats.operationsBreakdown.add,
                  color: 'bg-blue-500'
                },
                {
                  label: 'Pengurangan (-)',
                  icon: '➖',
                  data: stats.operationsBreakdown.sub,
                  color: 'bg-emerald-500'
                },
                {
                  label: 'Perkalian (×)',
                  icon: '✖️',
                  data: stats.operationsBreakdown.mul,
                  color: 'bg-amber-500'
                },
                {
                  label: 'Pembagian (÷)',
                  icon: '➗',
                  data: stats.operationsBreakdown.div,
                  color: 'bg-purple-500'
                }
              ].map(op => {
                const percent = calcOpPercent(op.data.correct, op.data.total);
                return (
                  <div key={op.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span>{op.icon}</span> {op.label}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {op.data.correct} / {op.data.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${op.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
