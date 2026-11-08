import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameMode } from '../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  winner: 'blue' | 'red' | 'draw';
  blueScore: number;
  blueCorrect: number;
  redScore: number;
  redCorrect: number;
  mode: GameMode;
  onPlayAgain: () => void;
  onGoToMenu: () => void;
  userTeam: 'blue' | 'red';
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  blueScore,
  blueCorrect,
  redScore,
  redCorrect,
  mode,
  onPlayAgain,
  onGoToMenu,
  userTeam
}) => {
  const isUserWinner = winner === userTeam || (mode === 'LOCAL_2P' && winner !== 'draw');

  useEffect(() => {
    if (isOpen && isUserWinner) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen, isUserWinner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border-4 border-amber-500 shadow-2xl overflow-hidden text-center">
        {/* Banner */}
        <div className={`p-6 ${winner === 'blue' ? 'bg-blue-600' : winner === 'red' ? 'bg-red-600' : 'bg-amber-600'} text-white`}>
          <div className="text-5xl mb-2 animate-bounce">
            {winner === 'draw' ? '🤝' : winner === userTeam ? '🏆' : '💪'}
          </div>
          <h2 className="font-game font-black text-2xl sm:text-3xl tracking-wide drop-shadow-md">
            {winner === 'draw'
              ? 'PERTANDINGAN IMBANG!'
              : winner === 'blue'
              ? 'TIM BIRU MENANG!'
              : 'TIM MERAH MENANG!'}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-semibold mt-1">
            {winner === userTeam
              ? 'Hebat sekali! Kekuatan hitunganmu menarik tali sampai garis akhir!'
              : mode === 'LOCAL_2P'
              ? 'Adu tarikan yang sangat seru antar teman!'
              : 'Pantang menyerah! Asah kembali kecepatan hitungmu dan coba lagi!'}
          </p>
        </div>

        {/* Scores summary */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-300">
              <span className="font-game font-bold text-xs text-blue-700 dark:text-blue-300 block">TIM BIRU</span>
              <span className="font-game font-black text-2xl text-blue-600 dark:text-blue-400 tabular-nums">
                {blueScore} Poin
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">{blueCorrect} Benar</span>
            </div>

            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-300">
              <span className="font-game font-bold text-xs text-red-700 dark:text-red-300 block">TIM MERAH</span>
              <span className="font-game font-black text-2xl text-red-600 dark:text-red-400 tabular-nums">
                {redScore} Poin
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">{redCorrect} Benar</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={onPlayAgain}
              className="w-full py-3 px-4 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-game font-black text-lg rounded-2xl shadow-lg cursor-pointer transform active:scale-98 transition-all"
            >
              Main Lagi! 🔄
            </button>

            <button
              type="button"
              onClick={onGoToMenu}
              className="w-full py-2.5 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-game font-bold text-sm rounded-xl cursor-pointer transition-colors"
            >
              Kembali ke Menu Utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
