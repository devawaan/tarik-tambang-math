import React from 'react';
import { PlayerCustomization } from '../types/game';

interface ScoreHeaderProps {
  round: number;
  timeLeft: number;
  blueScore: number;
  blueCorrect: number;
  redScore: number;
  redCorrect: number;
  blueCustom: PlayerCustomization;
  redCustom: PlayerCustomization;
  mode: string;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  round,
  timeLeft,
  blueScore,
  blueCorrect,
  redScore,
  redCorrect,
  blueCustom,
  redCustom,
  mode
}) => {
  const isUrgent = timeLeft <= 5 && timeLeft > 0;

  return (
    <div className="relative w-full max-w-5xl mx-auto px-2 pt-2 flex items-start justify-between gap-2 z-20">
      {/* TIM BIRU CARD */}
      <div className="blue-team-card rounded-2xl p-2.5 sm:p-3 text-white flex items-center gap-2.5 sm:gap-3 min-w-[130px] sm:min-w-[200px] shadow-lg transform transition-transform hover:scale-[1.02]">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-300 border-2 border-white overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
          {blueCustom.gender === 'girl' ? (
            <span className="text-3xl sm:text-4xl" role="img" aria-label="Blue Girl">👧</span>
          ) : blueCustom.gender === 'mascot' ? (
            <span className="text-3xl sm:text-4xl" role="img" aria-label="Blue Mascot">🦁</span>
          ) : (
            <span className="text-3xl sm:text-4xl" role="img" aria-label="Blue Boy">👦</span>
          )}
          {/* Blue Headband indicator */}
          <div className="absolute top-1.5 inset-x-0 h-1.5 bg-blue-600 border-y border-white opacity-80" />
        </div>
        <div className="leading-tight">
          <div className="font-game font-black text-sm sm:text-xl tracking-wider text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] uppercase">
            {blueCustom.nickname || 'TIM BIRU'}
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white/95 mt-0.5">
            <span>Skor: <span className="font-black text-yellow-200">{blueScore}</span></span>
            <span className="text-blue-200">·</span>
            <span>Benar: <span className="font-black text-green-300">{blueCorrect}</span></span>
          </div>
        </div>
      </div>

      {/* CENTER WOODEN ROUND & CLOCK BANNER */}
      <div className="flex flex-col items-center shrink-0 -mt-1 sm:mt-0">
        {/* Top plank: Ronde X */}
        <div className="relative px-5 sm:px-8 py-1 wood-panel rounded-t-xl text-center shadow-md border-b-2 border-amber-950">
          {/* Hanging ropes visual */}
          <div className="absolute -top-3 left-3 w-1.5 h-3 bg-amber-900 rounded-full" />
          <div className="absolute -top-3 right-3 w-1.5 h-3 bg-amber-900 rounded-full" />
          <span className="font-game font-black text-amber-100 text-xs sm:text-base tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
            {mode === 'TIME_ATTACK' ? 'Tantangan Waktu' : `Ronde ${round}`}
          </span>
        </div>

        {/* Round Clock Timer */}
        <div className={`relative -mt-1.5 flex items-center justify-center px-4 sm:px-6 py-1 sm:py-1.5 rounded-full border-3 sm:border-4 border-amber-800 bg-linear-to-b from-amber-100 to-amber-200 shadow-xl ${isUrgent ? 'animate-bounce scale-110 ring-4 ring-red-500' : ''}`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 ${isUrgent ? 'text-red-600 animate-spin' : 'text-amber-900'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span
              className={`font-game font-black text-xl sm:text-3xl tabular-nums ${
                isUrgent ? 'text-red-600' : 'text-amber-950'
              }`}
            >
              {timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* TIM MERAH CARD */}
      <div className="red-team-card rounded-2xl p-2.5 sm:p-3 text-white flex items-center justify-end gap-2.5 sm:gap-3 min-w-[130px] sm:min-w-[200px] shadow-lg transform transition-transform hover:scale-[1.02]">
        <div className="text-right leading-tight order-1 sm:order-1">
          <div className="font-game font-black text-sm sm:text-xl tracking-wider text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] uppercase">
            {redCustom.nickname || 'TIM MERAH'}
          </div>
          <div className="flex items-center justify-end gap-2 text-xs sm:text-sm font-bold text-white/95 mt-0.5">
            <span>Skor: <span className="font-black text-yellow-200">{redScore}</span></span>
            <span className="text-red-200">·</span>
            <span>Benar: <span className="font-black text-green-300">{redCorrect}</span></span>
          </div>
        </div>
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-300 border-2 border-white overflow-hidden flex items-center justify-center shrink-0 shadow-inner order-2 sm:order-2">
          {redCustom.gender === 'boy' ? (
            <span className="text-3xl sm:text-4xl" role="img" aria-label="Red Boy">👦</span>
          ) : redCustom.gender === 'mascot' ? (
            <span className="text-3xl sm:text-4xl" role="img" aria-label="Red Mascot">🐯</span>
          ) : (
            <span className="text-3xl sm:text-4xl" role="img" aria-label="Red Girl">👧</span>
          )}
          {/* Red Headband indicator */}
          <div className="absolute top-1.5 inset-x-0 h-1.5 bg-red-600 border-y border-white opacity-80" />
        </div>
      </div>
    </div>
  );
};
