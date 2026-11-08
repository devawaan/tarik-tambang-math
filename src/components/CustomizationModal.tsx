import React, { useState } from 'react';
import { PlayerCustomization } from '../types/game';
import { loadAchievements, saveCustomization } from '../utils/storage';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCustom: PlayerCustomization;
  onSave: (custom: PlayerCustomization) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  currentCustom,
  onSave
}) => {
  const [nickname, setNickname] = useState(currentCustom.nickname);
  const [gender, setGender] = useState<PlayerCustomization['gender']>(currentCustom.gender);
  const [headbandColor, setHeadbandColor] = useState(currentCustom.headbandColor);
  const [teamIcon, setTeamIcon] = useState<PlayerCustomization['teamIcon']>(currentCustom.teamIcon);
  const [title, setTitle] = useState(currentCustom.title);

  if (!isOpen) return null;

  const achievements = loadAchievements();
  const unlockedTitles = achievements
    .filter(a => a.unlocked && a.rewardTitle)
    .map(a => a.rewardTitle as string);

  const allTitles = ['Penarik Kilat', 'Juara Angka', 'Pakar Matematika', ...unlockedTitles];

  const handleSave = () => {
    const updated: PlayerCustomization = {
      nickname: nickname.trim() || 'Jagoan Angka',
      gender,
      headbandColor,
      outfitColor: currentCustom.outfitColor,
      teamIcon,
      title
    };
    saveCustomization(updated);
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border-4 border-amber-500 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="wood-panel px-6 py-4 flex items-center justify-between border-b-4 border-amber-950 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <div>
              <h2 className="font-game font-black text-xl sm:text-2xl text-amber-100 drop-shadow-xs">
                Kustomisasi Karakter
              </h2>
              <p className="text-xs text-amber-200">
                Pilih gaya penarik dan lambang tim kesukaanmu
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

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* LIVE AVATAR PREVIEW CARD */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-white flex items-center gap-4 shadow-md">
            <div className="relative w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-4xl shrink-0 shadow-inner">
              {gender === 'girl' ? '👧' : gender === 'mascot' ? '🦁' : '👦'}
              {/* Headband indicator */}
              <div
                className={`absolute top-2 inset-x-0 h-2 border-y border-white/80 opacity-90 ${
                  headbandColor === 'red'
                    ? 'bg-red-600'
                    : headbandColor === 'gold'
                    ? 'bg-yellow-400'
                    : headbandColor === 'black'
                    ? 'bg-slate-900'
                    : 'bg-blue-600'
                }`}
              />
            </div>
            <div>
              <div className="font-game font-black text-xl text-yellow-300">
                {nickname || 'Jagoan Angka'}
              </div>
              <div className="text-xs text-blue-100 font-semibold">
                Gelar: <span className="text-white underline">{title}</span>
              </div>
              <div className="text-[11px] text-blue-200 mt-0.5">
                Maskot: {teamIcon === 'lion' ? 'Singa 🦁' : teamIcon === 'eagle' ? 'Elang 🦅' : teamIcon === 'tiger' ? 'Harimau 🐯' : 'Naga 🐲'}
              </div>
            </div>
          </div>

          {/* Nickname Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Panggilan Pemain:
            </label>
            <input
              type="text"
              maxLength={16}
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-amber-300 dark:border-slate-700 bg-amber-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-game font-bold text-base focus:outline-hidden focus:border-amber-500"
              placeholder="Masukkan nama..."
            />
          </div>

          {/* Gender / Avatar Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tipe Karakter:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'boy', label: 'Anak Laki-laki', icon: '👦' },
                { type: 'girl', label: 'Anak Perempuan', icon: '👧' },
                { type: 'mascot', label: 'Maskot Singa', icon: '🦁' }
              ].map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setGender(item.type as PlayerCustomization['gender'])}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    gender === item.type
                      ? 'border-amber-500 bg-amber-100 dark:bg-amber-950/50 font-black'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl block mb-1">{item.icon}</span>
                  <span className="text-xs text-slate-800 dark:text-slate-200">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Headband Color */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Warna Ikat Kepala (Headband):
            </label>
            <div className="flex gap-2">
              {[
                { id: 'blue', label: 'Biru', bg: 'bg-blue-600' },
                { id: 'red', label: 'Merah', bg: 'bg-red-600' },
                { id: 'gold', label: 'Emas Juara', bg: 'bg-amber-500' },
                { id: 'black', label: 'Ninja Hitam', bg: 'bg-slate-900' }
              ].map(h => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHeadbandColor(h.id)}
                  className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex flex-col items-center gap-1 ${h.bg} ${
                    headbandColor === h.id ? 'ring-3 ring-amber-400 scale-105' : 'opacity-80'
                  }`}
                >
                  <span>{h.label}</span>
                  {headbandColor === h.id && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Team Icon */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Lambang Tim:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'lion', label: 'Singa', icon: '🦁' },
                { id: 'eagle', label: 'Elang', icon: '🦅' },
                { id: 'tiger', label: 'Harimau', icon: '🐯' },
                { id: 'dragon', label: 'Naga', icon: '🐲' }
              ].map(iconItem => (
                <button
                  key={iconItem.id}
                  type="button"
                  onClick={() => setTeamIcon(iconItem.id as PlayerCustomization['teamIcon'])}
                  className={`p-2 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    teamIcon === iconItem.id
                      ? 'border-amber-500 bg-amber-100 dark:bg-amber-950/50'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl block">{iconItem.icon}</span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{iconItem.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Gelar Kehormatan:
            </label>
            <select
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-amber-300 dark:border-slate-700 bg-amber-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold focus:outline-hidden focus:border-amber-500"
            >
              {allTitles.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 mt-1">
              *Buka lebih banyak gelar dengan menyelesaikan Sistem Pencapaian!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-50 dark:bg-slate-800 border-t border-amber-200 dark:border-slate-700 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold text-xs hover:text-slate-900 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-md"
          >
            Simpan Kustomisasi
          </button>
        </div>
      </div>
    </div>
  );
};
