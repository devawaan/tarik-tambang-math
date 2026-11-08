import React, { useState } from 'react';
import { MathQuestion } from '../types/game';

interface AnswerPadProps {
  team: 'blue' | 'red';
  label: string;
  question: MathQuestion | null;
  onAnswer: (answer: number) => void;
  disabled: boolean;
  hotkeys: string[];
  isAiControlled?: boolean;
}

export const AnswerPad: React.FC<AnswerPadProps> = ({
  team,
  label,
  question,
  onAnswer,
  disabled,
  hotkeys,
  isAiControlled = false
}) => {
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const isBlue = team === 'blue';

  const handleSelectOption = (num: number) => {
    if (disabled || isAiControlled) return;
    setSelectedNum(num);
    onAnswer(num);
  };

  const currentDisplay = selectedNum !== null ? selectedNum : (question?.options[0] ?? '--');

  return (
    <div
      className={`relative w-full max-w-sm mx-auto p-2 sm:p-3 rounded-2xl shadow-xl transition-all ${
        isBlue
          ? 'bg-blue-600 border-3 border-blue-400 text-white'
          : 'bg-red-600 border-3 border-red-400 text-white'
      } ${disabled ? 'opacity-80' : ''}`}
    >
      {/* HEADER LABEL */}
      <div className="flex items-center justify-between mb-1 sm:mb-2 px-1">
        <span className="font-game font-bold text-xs sm:text-sm drop-shadow-xs tracking-wide">
          {label}
        </span>
        {isAiControlled ? (
          <span className="text-[10px] sm:text-xs bg-black/25 px-2 py-0.5 rounded-full font-semibold">
            🤖 AI Bot
          </span>
        ) : (
          <span className="text-[10px] text-white/80 hidden sm:inline">
            1-Klik Cepat!
          </span>
        )}
      </div>

      {/* DISPLAY BOX & GREEN CHECKMARK (Matching Screenshot) */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 bg-white rounded-xl py-1.5 sm:py-2 px-3 text-center border-2 border-slate-300 shadow-inner flex items-center justify-center min-h-[46px]">
          <span className="font-game font-black text-2xl sm:text-3xl text-slate-800 tabular-nums">
            {isAiControlled ? '???' : currentDisplay}
          </span>
        </div>

        {/* Green Checkmark Action Button */}
        <button
          type="button"
          disabled={disabled || isAiControlled}
          onClick={() => {
            if (selectedNum !== null) {
              onAnswer(selectedNum);
            } else if (question) {
              onAnswer(question.options[0]);
            }
          }}
          className="btn-3d-green w-12 h-12 sm:w-14 sm:h-12 rounded-xl flex items-center justify-center shrink-0 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Kirim Jawaban"
        >
          <svg className="w-7 h-7 drop-shadow-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>

      {/* 4 FAST 1-TAP MULTIPLE CHOICE BUTTONS */}
      {!isAiControlled ? (
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {question?.options.map((opt, idx) => {
            const hotkeyLabel = hotkeys[idx] || `${idx + 1}`;
            return (
              <button
                key={`${question.id}_${opt}_${idx}`}
                type="button"
                disabled={disabled}
                onClick={() => handleSelectOption(opt)}
                className={`relative py-2 sm:py-2.5 px-2 rounded-xl font-game font-bold text-lg sm:text-xl text-slate-900 bg-white hover:bg-yellow-200 active:scale-95 transition-all cursor-pointer border-2 shadow-md flex items-center justify-between ${
                  isBlue ? 'border-blue-300' : 'border-red-300'
                } disabled:cursor-not-allowed`}
              >
                {/* Hotkey Badge */}
                <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded shadow-xs">
                  {hotkeyLabel}
                </span>

                {/* Option Value */}
                <span className="flex-1 text-center font-black tabular-nums">
                  {opt}
                </span>

                <span className="w-4" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="py-4 text-center bg-black/15 rounded-xl border border-white/20">
          <span className="font-game text-xs sm:text-sm text-white/90 animate-pulse">
            AI sedang menghitung kekuatan tarikan... ⚡
          </span>
        </div>
      )}
    </div>
  );
};
