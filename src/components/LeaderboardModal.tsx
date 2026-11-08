import React, { useState } from 'react';
import { GameMode, LeaderboardEntry } from '../types/game';
import { loadLeaderboard } from '../utils/storage';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [filterMode, setFilterMode] = useState<GameMode | 'ALL'>('ALL');
  const [timeRange, setTimeRange] = useState<'ALL' | 'TODAY'>('ALL');

  if (!isOpen) return null;

  const entries = loadLeaderboard();
  const todayStr = new Date().toISOString().split('T')[0];

  const filtered = entries.filter(item => {
    if (filterMode !== 'ALL' && item.mode !== filterMode) return false;
    if (timeRange === 'TODAY' && item.date !== todayStr) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border-4 border-amber-500 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="wood-panel px-6 py-4 flex items-center justify-between border-b-4 border-amber-950 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h2 className="font-game font-black text-xl sm:text-2xl text-amber-100 drop-shadow-xs">
                Papan Skor Global
              </h2>
              <p className="text-xs text-amber-200">
                Peringkat penarik tambang matematika terhebat
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

        {/* Filter Controls */}
        <div className="p-3 bg-amber-50/80 dark:bg-slate-800/80 border-b border-amber-200 dark:border-slate-700 flex flex-wrap gap-2 items-center justify-between text-xs sm:text-sm">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-amber-200/60 dark:bg-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterMode === 'ALL'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 dark:text-slate-300 hover:text-amber-950'
              }`}
            >
              Semua Mode
            </button>
            <button
              onClick={() => setFilterMode('SINGLE_AI')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterMode === 'SINGLE_AI'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 dark:text-slate-300 hover:text-amber-950'
              }`}
            >
              Lawan AI
            </button>
            <button
              onClick={() => setFilterMode('TIME_ATTACK')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterMode === 'TIME_ATTACK'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 dark:text-slate-300 hover:text-amber-950'
              }`}
            >
              Tantangan Waktu
            </button>
            <button
              onClick={() => setFilterMode('LOCAL_2P')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterMode === 'LOCAL_2P'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 dark:text-slate-300 hover:text-amber-950'
              }`}
            >
              2 Pemain
            </button>
          </div>

          {/* Time Range Tabs */}
          <div className="flex items-center gap-1 bg-amber-200/60 dark:bg-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setTimeRange('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                timeRange === 'ALL'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-900 dark:text-slate-300'
              }`}
            >
              Semua Waktu
            </button>
            <button
              onClick={() => setTimeRange('TODAY')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                timeRange === 'TODAY'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-900 dark:text-slate-300'
              }`}
            >
              Hari Ini
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-amber-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <span className="text-4xl block mb-2">📜</span>
              Belum ada rekor di kategori ini. Jadilah yang pertama mencetak rekor!
            </div>
          ) : (
            filtered.map((entry, index) => {
              const rank = index + 1;
              const isMedal = rank <= 3;
              const medalIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';

              return (
                <div
                  key={entry.id}
                  className={`py-2.5 px-3 rounded-2xl flex items-center justify-between gap-3 transition-colors ${
                    entry.isUser
                      ? 'bg-amber-100/80 dark:bg-amber-950/40 border-2 border-amber-400 font-bold'
                      : 'hover:bg-amber-50/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-8 text-center font-game font-black text-lg">
                      {isMedal ? (
                        <span className="text-2xl drop-shadow-xs">{medalIcon}</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 tabular-nums">#{rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-amber-200 dark:bg-slate-700 flex items-center justify-center text-xl border border-amber-300 shrink-0">
                      {entry.avatar === 'girl' ? '👧' : entry.avatar === 'mascot' ? '🦁' : '👦'}
                    </div>

                    {/* Name & Mode */}
                    <div>
                      <div className="font-game font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{entry.playerName}</span>
                        {entry.isUser && (
                          <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-black">
                            KAMU
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>
                          {entry.mode === 'TIME_ATTACK'
                            ? 'Tantangan Waktu'
                            : entry.mode === 'LOCAL_2P'
                            ? '2 Pemain Lokal'
                            : `Lawan AI (${entry.difficulty || 'Normal'})`}
                        </span>
                        <span>·</span>
                        <span>Akurasi {entry.accuracy}%</span>
                        <span>·</span>
                        <span>Streak {entry.streak}x</span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <span className="font-game font-black text-lg sm:text-2xl text-amber-600 dark:text-amber-400 tabular-nums">
                      {entry.score.toLocaleString('id-ID')}
                    </span>
                    <span className="block text-[10px] text-slate-400">Poin</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-50 dark:bg-slate-800 border-t border-amber-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Skor tersimpan otomatis setiap akhir pertandingan.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
