import React from 'react';
import { PlayerCustomization } from '../types/game';

interface TugOfWarArenaProps {
  ropeOffset: number; // -100 (Blue full win) to +100 (Red full win), 0 is center
  bluePulling: boolean;
  redPulling: boolean;
  blueCustom: PlayerCustomization;
  redCustom: PlayerCustomization;
  isDarkMode: boolean;
  lastPullTeam: 'blue' | 'red' | null;
}

export const TugOfWarArena: React.FC<TugOfWarArenaProps> = ({
  ropeOffset,
  bluePulling,
  redPulling,
  blueCustom,
  redCustom,
  isDarkMode,
  lastPullTeam
}) => {
  // Normalize rope offset for pixel translation: max translation e.g. 90px left/right
  const ropeShiftPx = (ropeOffset / 100) * 85;

  // Percentage for the bottom gauge (0% is full blue, 100% is full red, 50% is center)
  const gaugePercent = Math.min(100, Math.max(0, 50 + (ropeOffset / 2)));

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[260px] sm:h-[320px] md:h-[350px] overflow-hidden rounded-3xl border-4 border-amber-900 shadow-2xl transition-all duration-300">
      {/* ARENA BACKGROUND */}
      {isDarkMode ? (
        // Night Arena with Floodlights
        <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900">
          {/* Night Stars & Stadium Glow */}
          <div className="absolute top-2 inset-x-0 flex justify-between px-12 opacity-80">
            <div className="w-16 h-12 bg-amber-200/20 rounded-full blur-xl" />
            <div className="w-20 h-12 bg-blue-300/20 rounded-full blur-xl" />
            <div className="w-16 h-12 bg-amber-200/20 rounded-full blur-xl" />
          </div>
          {/* Stadium Floodlights beam */}
          <div className="absolute -top-10 left-10 w-32 h-64 bg-linear-to-b from-yellow-300/15 to-transparent rotate-12 blur-md pointer-events-none" />
          <div className="absolute -top-10 right-10 w-32 h-64 bg-linear-to-b from-yellow-300/15 to-transparent -rotate-12 blur-md pointer-events-none" />
        </div>
      ) : (
        // Bright Sunny School Field
        <div className="absolute inset-0 bg-linear-to-b from-sky-400 via-sky-200 to-emerald-400">
          {/* Fluffy Clouds */}
          <div className="absolute top-2 left-6 w-24 h-8 bg-white/80 rounded-full blur-[1px]" />
          <div className="absolute top-5 right-12 w-32 h-10 bg-white/85 rounded-full blur-[1px]" />
          {/* Distant trees */}
          <div className="absolute top-12 inset-x-0 h-16 bg-emerald-600/40 rounded-t-[50%] scale-110" />
        </div>
      )}

      {/* FESTIVE BUNTING FLAGS */}
      <div className="absolute top-0 inset-x-0 flex justify-between items-center px-4 overflow-hidden z-10 pointer-events-none">
        <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 500 30">
          <path d="M0,5 Q125,20 250,8 Q375,20 500,5" fill="none" stroke="#64748b" strokeWidth="1.5" />
          {/* Colorful Bunting Triangles */}
          {[
            { x: 30, color: '#ef4444' },
            { x: 75, color: '#3b82f6' },
            { x: 120, color: '#eab308' },
            { x: 165, color: '#10b981' },
            { x: 210, color: '#f97316' },
            { x: 255, color: '#8b5cf6' },
            { x: 300, color: '#ec4899' },
            { x: 345, color: '#06b6d4' },
            { x: 390, color: '#ef4444' },
            { x: 435, color: '#3b82f6' },
            { x: 475, color: '#eab308' }
          ].map((flag, idx) => (
            <polygon
              key={idx}
              points={`${flag.x - 10},10 ${flag.x + 10},10 ${flag.x},24`}
              fill={flag.color}
              className="drop-shadow-xs"
            />
          ))}
        </svg>
      </div>

      {/* CHEERING CROWD SILHOUETTES IN BACKGROUND */}
      <div className="absolute top-14 sm:top-16 inset-x-0 flex justify-around items-end h-16 px-4 opacity-75 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => {
          const isBlueSide = i < 6;
          return (
            <div
              key={i}
              className={`transform transition-transform duration-300 ${
                (isBlueSide && bluePulling) || (!isBlueSide && redPulling)
                  ? 'scale-110 -translate-y-2'
                  : 'scale-100'
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    isBlueSide ? 'bg-blue-400' : 'bg-red-400'
                  } border border-white/60 shadow-xs`}
                />
                <div
                  className={`w-6 h-6 rounded-t-lg -mt-1 ${
                    isBlueSide ? 'bg-blue-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* DIRT GROUND & ARENA MARKINGS */}
      <div className="absolute bottom-0 inset-x-0 h-32 sm:h-36 bg-linear-to-b from-amber-200 via-amber-300 to-amber-500 dark:from-stone-700 dark:via-stone-800 dark:to-stone-900 border-t-4 border-amber-600 dark:border-stone-600">
        {/* Grassy side patches */}
        <div className="absolute top-0 left-0 w-28 sm:w-48 h-10 bg-emerald-500 dark:bg-emerald-800 rounded-br-3xl opacity-75" />
        <div className="absolute top-0 right-0 w-28 sm:w-48 h-10 bg-emerald-500 dark:bg-emerald-800 rounded-bl-3xl opacity-75" />

        {/* Center White Boundary Marker Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 sm:w-3.5 bg-white/90 shadow-md border-x border-amber-800/30 flex flex-col items-center justify-between py-1">
          <div className="w-1.5 h-3 bg-red-500 rounded-full" />
          <div className="w-1.5 h-3 bg-red-500 rounded-full" />
        </div>
      </div>

      {/* THE TUG OF WAR CHARACTERS & ROPE LAYER */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${ropeShiftPx}px)` }}
      >
        {/* ROPE */}
        <div className="absolute top-[54%] inset-x-0 -translate-y-1/2 h-6 flex items-center">
          {/* Braided Rope Pattern */}
          <div
            className="w-full h-4 sm:h-5 rounded-full border-y-2 border-amber-950 shadow-md"
            style={{
              background: 'repeating-linear-gradient(45deg, #d97706, #d97706 10px, #b45309 10px, #b45309 20px)'
            }}
          />

          {/* Red Ribbon Center Marker */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center z-30">
            {/* Knot */}
            <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-red-900 shadow-md flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-red-400" />
            </div>
            {/* Ribbon Tails hanging down */}
            <div className="w-4 h-7 -mt-1 bg-red-600 border-x-2 border-b-2 border-red-900 rounded-b-md shadow-lg transform -rotate-3" />
          </div>
        </div>

        {/* LEFT: TIM BIRU CHARACTERS (PULLING TO THE LEFT) */}
        <div className="absolute left-[3%] sm:left-[8%] top-[34%] sm:top-[30%] flex items-end gap-1 sm:gap-2">
          {/* Character 1: Blue Boy / Mascot */}
          <div
            className={`relative flex flex-col items-center transform transition-all duration-150 ${
              bluePulling ? '-translate-x-2 -rotate-12 scale-105' : '-rotate-6'
            }`}
          >
            {/* Sweat drops if pulling */}
            {bluePulling && (
              <div className="absolute -top-3 right-0 text-sky-400 font-bold text-lg animate-ping">
                💦
              </div>
            )}
            {/* Dust puff under feet */}
            <div
              className={`absolute -bottom-2 -left-2 text-xl opacity-90 transition-opacity ${
                bluePulling ? 'opacity-100 scale-125' : 'opacity-40'
              }`}
            >
              💨
            </div>

            {/* Boy Vector Sprite */}
            <svg className="w-16 h-28 sm:w-20 sm:h-34 drop-shadow-md" viewBox="0 0 80 120">
              {/* Head with Blue Headband */}
              <circle cx="46" cy="30" r="20" fill="#fbcfe8" stroke="#1e3a8a" strokeWidth="2" />
              {/* Hair */}
              <path d="M26,30 Q35,8 54,16 Q68,24 64,36 Q50,22 36,26 Z" fill="#78350f" />
              {/* Blue Headband */}
              <rect x="28" y="24" width="34" height="7" rx="3" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1.5" />
              <rect x="42" y="25" width="6" height="5" fill="#ffffff" />
              {/* Face expression: Determined pulling face */}
              <circle cx="40" cy="33" r="2.5" fill="#1e293b" />
              <circle cx="52" cy="33" r="2.5" fill="#1e293b" />
              {/* Gritted teeth */}
              <rect x="42" y="40" width="10" height="4" rx="1.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />

              {/* Leaning Body / Uniform */}
              <path d="M34,50 L56,50 L50,85 L28,85 Z" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="2" />
              <text x="37" y="70" fontSize="11" fontWeight="bold" fill="#ffffff">B</text>

              {/* Arms gripping rope */}
              <path d="M46,55 Q65,65 74,68" fill="none" stroke="#fbcfe8" strokeWidth="7" strokeLinecap="round" />
              <circle cx="74" cy="68" r="4.5" fill="#fbcfe8" stroke="#1e3a8a" strokeWidth="1" />

              {/* Legs braced back */}
              <path d="M32,85 L20,110" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" />
              <path d="M46,85 L36,112" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" />
              {/* Blue shoes */}
              <rect x="12" y="106" width="16" height="7" rx="3" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1.5" />
              <rect x="28" y="108" width="16" height="7" rx="3" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Character 2: Blue Ponytail Girl */}
          <div
            className={`relative flex flex-col items-center transform transition-all duration-150 ${
              bluePulling ? '-translate-x-3 -rotate-14 scale-105' : '-rotate-8'
            }`}
          >
            {/* Girl Vector Sprite */}
            <svg className="w-16 h-28 sm:w-20 sm:h-34 drop-shadow-md" viewBox="0 0 80 120">
              {/* Ponytail */}
              <path d="M22,28 Q8,18 12,38 Q18,48 24,36 Z" fill="#451a03" />
              {/* Head */}
              <circle cx="44" cy="30" r="19" fill="#fde68a" stroke="#1e3a8a" strokeWidth="2" />
              {/* Hair bangs */}
              <path d="M28,26 Q42,12 58,22 Q60,34 50,30 Z" fill="#451a03" />
              {/* Blue Headband */}
              <rect x="28" y="24" width="30" height="6" rx="2" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1.5" />
              {/* Determined eyes */}
              <circle cx="39" cy="32" r="2.5" fill="#1e293b" />
              <circle cx="50" cy="32" r="2.5" fill="#1e293b" />
              {/* Gritting mouth */}
              <path d="M41,40 L49,40" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

              {/* Sports Dress / Shirt */}
              <path d="M34,48 L54,48 L48,84 L28,84 Z" fill="#2563eb" stroke="#1e3a8a" strokeWidth="2" />

              {/* Arms gripping rope */}
              <path d="M42,54 Q60,65 70,68" fill="none" stroke="#fde68a" strokeWidth="6" strokeLinecap="round" />
              <circle cx="70" cy="68" r="4" fill="#fde68a" stroke="#1e3a8a" strokeWidth="1" />

              {/* Braced legs */}
              <path d="M32,84 L22,108" stroke="#1e3a8a" strokeWidth="7" strokeLinecap="round" />
              <path d="M44,84 L36,110" stroke="#1e3a8a" strokeWidth="7" strokeLinecap="round" />
              <rect x="14" y="105" width="15" height="6" rx="3" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" />
              <rect x="28" y="107" width="15" height="6" rx="3" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* RIGHT: TIM MERAH CHARACTERS (PULLING TO THE RIGHT) */}
        <div className="absolute right-[3%] sm:right-[8%] top-[34%] sm:top-[30%] flex items-end gap-1 sm:gap-2">
          {/* Character 1: Red Ponytail Girl */}
          <div
            className={`relative flex flex-col items-center transform transition-all duration-150 ${
              redPulling ? 'translate-x-3 rotate-14 scale-105' : 'rotate-8'
            }`}
          >
            {/* Girl Vector Sprite */}
            <svg className="w-16 h-28 sm:w-20 sm:h-34 drop-shadow-md" viewBox="0 0 80 120">
              {/* Ponytail */}
              <path d="M58,28 Q72,18 68,38 Q62,48 56,36 Z" fill="#451a03" />
              {/* Head */}
              <circle cx="36" cy="30" r="19" fill="#fde68a" stroke="#7f1d1d" strokeWidth="2" />
              {/* Hair bangs */}
              <path d="M52,26 Q38,12 22,22 Q20,34 30,30 Z" fill="#451a03" />
              {/* Red Headband */}
              <rect x="22" y="24" width="30" height="6" rx="2" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
              {/* Ribbon bow on headband */}
              <circle cx="50" cy="22" r="3" fill="#dc2626" />
              {/* Determined eyes */}
              <circle cx="41" cy="32" r="2.5" fill="#1e293b" />
              <circle cx="30" cy="32" r="2.5" fill="#1e293b" />
              {/* Gritting mouth */}
              <path d="M31,40 L39,40" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

              {/* Sports Dress / Shirt */}
              <path d="M46,48 L26,48 L32,84 L52,84 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />

              {/* Arms gripping rope */}
              <path d="M38,54 Q20,65 10,68" fill="none" stroke="#fde68a" strokeWidth="6" strokeLinecap="round" />
              <circle cx="10" cy="68" r="4" fill="#fde68a" stroke="#7f1d1d" strokeWidth="1" />

              {/* Braced legs */}
              <path d="M48,84 L58,108" stroke="#7f1d1d" strokeWidth="7" strokeLinecap="round" />
              <path d="M36,84 L44,110" stroke="#7f1d1d" strokeWidth="7" strokeLinecap="round" />
              <rect x="51" y="105" width="15" height="6" rx="3" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
              <rect x="37" y="107" width="15" height="6" rx="3" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Character 2: Red Boy */}
          <div
            className={`relative flex flex-col items-center transform transition-all duration-150 ${
              redPulling ? 'translate-x-2 rotate-12 scale-105' : 'rotate-6'
            }`}
          >
            {/* Sweat drops if pulling */}
            {redPulling && (
              <div className="absolute -top-3 left-0 text-red-400 font-bold text-lg animate-ping">
                💦
              </div>
            )}
            {/* Dust puff under feet */}
            <div
              className={`absolute -bottom-2 -right-2 text-xl opacity-90 transition-opacity ${
                redPulling ? 'opacity-100 scale-125' : 'opacity-40'
              }`}
            >
              💨
            </div>

            {/* Boy Vector Sprite */}
            <svg className="w-16 h-28 sm:w-20 sm:h-34 drop-shadow-md" viewBox="0 0 80 120">
              {/* Head with Red Headband */}
              <circle cx="34" cy="30" r="20" fill="#fbcfe8" stroke="#7f1d1d" strokeWidth="2" />
              {/* Hair */}
              <path d="M54,30 Q45,8 26,16 Q12,24 16,36 Q30,22 44,26 Z" fill="#78350f" />
              {/* Red Headband with tied knot */}
              <rect x="18" y="24" width="34" height="7" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
              <polygon points="50,23 58,21 54,29" fill="#dc2626" />
              {/* Face expression: Determined pulling face */}
              <circle cx="40" cy="33" r="2.5" fill="#1e293b" />
              <circle cx="28" cy="33" r="2.5" fill="#1e293b" />
              {/* Gritted teeth */}
              <rect x="28" y="40" width="10" height="4" rx="1.5" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />

              {/* Leaning Body / Uniform */}
              <path d="M46,50 L24,50 L30,85 L52,85 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2" />
              <text x="35" y="70" fontSize="11" fontWeight="bold" fill="#ffffff">M</text>

              {/* Arms gripping rope */}
              <path d="M34,55 Q15,65 6,68" fill="none" stroke="#fbcfe8" strokeWidth="7" strokeLinecap="round" />
              <circle cx="6" cy="68" r="4.5" fill="#fbcfe8" stroke="#7f1d1d" strokeWidth="1" />

              {/* Legs braced back */}
              <path d="M48,85 L60,110" stroke="#7f1d1d" strokeWidth="8" strokeLinecap="round" />
              <path d="M34,85 L44,112" stroke="#7f1d1d" strokeWidth="8" strokeLinecap="round" />
              {/* Red shoes */}
              <rect x="52" y="106" width="16" height="7" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
              <rect x="36" y="108" width="16" height="7" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION TEXT (e.g. "+Kekuatan!" or "Tarik!") */}
      {lastPullTeam && (
        <div
          className={`absolute top-28 ${
            lastPullTeam === 'blue' ? 'left-1/4' : 'right-1/4'
          } animate-float-text pointer-events-none z-30`}
        >
          <span
            className={`font-game font-black text-xl sm:text-2xl px-3 py-1 rounded-full text-white shadow-lg ${
              lastPullTeam === 'blue' ? 'bg-blue-600' : 'bg-red-600'
            }`}
          >
            +Kekuatan Tarikan! 💥
          </span>
        </div>
      )}

      {/* BOTTOM "TALI BERGERAK!" WOODEN BANNER & BALANCE GAUGE (matching screenshot exactly) */}
      <div className="absolute bottom-2 inset-x-0 flex flex-col items-center justify-center px-4 z-20">
        {/* Wooden Label "Tali Bergerak!" */}
        <div className="relative px-5 py-0.5 wood-panel rounded-lg shadow-md -mb-1 z-10">
          <span className="font-game font-black text-xs sm:text-sm text-amber-100 tracking-wide drop-shadow-xs">
            Tali Bergerak!
          </span>
        </div>

        {/* Balance Track Gauge */}
        <div className="relative w-64 sm:w-80 md:w-96 h-5 sm:h-6 rounded-full p-1 bg-amber-950 border-2 sm:border-3 border-amber-500 shadow-inner overflow-hidden flex items-center">
          {/* Blue half */}
          <div className="w-1/2 h-full bg-linear-to-r from-blue-600 to-blue-400 rounded-l-full" />
          {/* Red half */}
          <div className="w-1/2 h-full bg-linear-to-r from-red-400 to-red-600 rounded-r-full" />

          {/* Center Dividing White Notch */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white -translate-x-1/2 z-10" />

          {/* Glowing Shining Star Marker representing Rope displacement */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-150 ease-out"
            style={{ left: `${gaugePercent}%` }}
          >
            {/* 8-pointed sparkling star */}
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xs animate-pulse opacity-90" />
              <svg className="w-full h-full text-white drop-shadow-[0_0_8px_rgba(255,255,0,0.9)]" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
