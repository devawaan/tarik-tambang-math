import React from 'react';
import { MathQuestion } from '../types/game';

interface MathBoardProps {
  question: MathQuestion | null;
  difficultyLevel: number;
}

export const MathBoard: React.FC<MathBoardProps> = ({ question, difficultyLevel }) => {
  if (!question) {
    return null;
  }

  return (
    <div className="relative w-full max-w-xl mx-auto my-1 z-20 px-3">
      {/* Hanging chains/ropes to top */}
      <div className="absolute -top-4 left-8 sm:left-12 w-2 h-5 bg-amber-950 rounded-sm shadow-sm" />
      <div className="absolute -top-4 right-8 sm:right-12 w-2 h-5 bg-amber-950 rounded-sm shadow-sm" />

      {/* Main Wood Board Container */}
      <div className="relative wood-panel rounded-2xl p-2 sm:p-2.5 shadow-2xl transition-all duration-200">
        {/* 4 Corner Screws / Bolts */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-linear-to-br from-amber-300 to-amber-900 border border-amber-950 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-amber-950 rotate-45" />
        </div>
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-linear-to-br from-amber-300 to-amber-900 border border-amber-950 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-amber-950 rotate-45" />
        </div>
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-linear-to-br from-amber-300 to-amber-900 border border-amber-950 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-amber-950 rotate-45" />
        </div>
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-linear-to-br from-amber-300 to-amber-900 border border-amber-950 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-amber-950 rotate-45" />
        </div>

        {/* Inner Parchment Plaque */}
        <div className="wood-panel-inner rounded-xl py-3 px-4 sm:py-4 sm:px-8 text-center border-2 border-amber-400">
          <div className="font-game font-black text-3xl sm:text-5xl md:text-6xl text-amber-950 tracking-wider select-none drop-shadow-xs">
            {question.expression}
          </div>

          {/* Level indicator dots underneath */}
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {[1, 2, 3, 4].map(lvl => (
              <div
                key={lvl}
                className={`w-2 h-2 rounded-full transition-colors ${
                  lvl <= difficultyLevel ? 'bg-amber-600' : 'bg-amber-300/60'
                }`}
                title={`Tingkat Kesulitan: ${difficultyLevel}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
