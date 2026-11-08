import { Achievement, AIDifficulty, DailyActivity, GameMode, LeaderboardEntry, PlayerCustomization, UserStats } from '../types/game';

const STATS_KEY = 'tarik_tambang_stats';
const ACHIEVEMENTS_KEY = 'tarik_tambang_achievements';
const LEADERBOARD_KEY = 'tarik_tambang_leaderboard';
const CUSTOMIZATION_KEY = 'tarik_tambang_customization';

const INITIAL_CUSTOMIZATION: PlayerCustomization = {
  nickname: 'Jagoan Angka',
  gender: 'boy',
  headbandColor: 'blue',
  outfitColor: 'blue',
  teamIcon: 'lion',
  title: 'Penarik Kilat'
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game',
    title: 'Tarik Pertama',
    description: 'Mainkan pertandingan tarik tambang pertamamu.',
    icon: '🎯',
    category: 'games',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardTitle: 'Penarik Pemula'
  },
  {
    id: 'streak_5',
    title: 'Kekuatan Beruntun',
    description: 'Capai 5 jawaban benar secara berturut-turut.',
    icon: '⚡',
    category: 'streak',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    rewardTitle: 'Kilat Berhitung'
  },
  {
    id: 'streak_10',
    title: 'Dewa Hitung',
    description: 'Capai 10 jawaban benar tanpa salah dalam satu game.',
    icon: '🔥',
    category: 'streak',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    rewardTitle: 'Master Kombinasi'
  },
  {
    id: 'speed_answer',
    title: 'Refleks Ninja',
    description: 'Jawab soal dengan benar dalam waktu kurang dari 2 detik.',
    icon: '⏱️',
    category: 'speed',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardTitle: 'Ninja Angka'
  },
  {
    id: 'beat_ai_hard',
    title: 'Penakluk Robot',
    description: 'Kalahkan AI pada tingkat kesulitan Jagoan (Hard) atau Genius.',
    icon: '🤖',
    category: 'games',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardTitle: 'Penakluk AI'
  },
  {
    id: 'play_local_2p',
    title: 'Adu Sahabat',
    description: 'Selesaikan pertandingan dalam mode 2 Pemain Lokal.',
    icon: '🤝',
    category: 'games',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardTitle: 'Raja Duel'
  },
  {
    id: 'time_attack_score',
    title: 'Tahan Banting',
    description: 'Capai skor minimal 1,500 di Mode Tantangan Waktu.',
    icon: '⏳',
    category: 'games',
    unlocked: false,
    progress: 0,
    maxProgress: 1500,
    rewardTitle: 'Pelari Waktu'
  },
  {
    id: 'solve_50',
    title: 'Kolektor Soal',
    description: 'Jawab total 50 perhitungan matematika dengan tepat.',
    icon: '📚',
    category: 'accuracy',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    rewardTitle: 'Ahli Aljabar'
  },
  {
    id: 'solve_100',
    title: 'Legenda Matematika',
    description: 'Jawab total 100 perhitungan matematika.',
    icon: '👑',
    category: 'accuracy',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    rewardTitle: 'Ksatria Matematika'
  },
  {
    id: 'streak_3_days',
    title: 'Disiplin Emas',
    description: 'Berlatih dan mainkan game selama 3 hari berturut-turut.',
    icon: '📅',
    category: 'streak',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    rewardTitle: 'Pejuang Disiplin'
  },
  {
    id: 'dark_mode_night',
    title: 'Pertandingan Malam',
    description: 'Mainkan pertandingan seru di Mode Gelap (Dark Mode).',
    icon: '🌙',
    category: 'games',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardTitle: 'Bintang Malam'
  },
  {
    id: 'perfect_win',
    title: 'Kemenangan Sempurna',
    description: 'Menangkan ronde tanpa sekalipun memberikan tali ke area lawan.',
    icon: '🏆',
    category: 'accuracy',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardTitle: 'Tug of War Champion'
  }
];

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb_1', playerName: 'Arjuna_MathPro', score: 3840, mode: 'TIME_ATTACK', accuracy: 98, streak: 24, avatar: 'boy', date: '2026-11-06' },
  { id: 'lb_2', playerName: 'Siti_Kalkulus', score: 3420, mode: 'SINGLE_AI', difficulty: 'GENIUS', accuracy: 96, streak: 19, avatar: 'girl', date: '2026-11-07' },
  { id: 'lb_3', playerName: 'Bima_TarikBaja', score: 3150, mode: 'TIME_ATTACK', accuracy: 94, streak: 16, avatar: 'mascot', date: '2026-11-05' },
  { id: 'lb_4', playerName: 'Kenzi_Tokyo', score: 2980, mode: 'SINGLE_AI', difficulty: 'HARD', accuracy: 92, streak: 14, avatar: 'boy', date: '2026-11-07' },
  { id: 'lb_5', playerName: 'Nadia_FastBrain', score: 2750, mode: 'LOCAL_2P', accuracy: 95, streak: 12, avatar: 'girl', date: '2026-11-04' },
  { id: 'lb_6', playerName: 'Rian_SpeedRun', score: 2620, mode: 'TIME_ATTACK', accuracy: 90, streak: 11, avatar: 'boy', date: '2026-11-06' },
  { id: 'lb_7', playerName: 'Maya_MathNinja', score: 2450, mode: 'SINGLE_AI', difficulty: 'HARD', accuracy: 91, streak: 10, avatar: 'girl', date: '2026-11-07' },
  { id: 'lb_8', playerName: 'Gavin_TugHero', score: 2280, mode: 'LOCAL_2P', accuracy: 88, streak: 9, avatar: 'mascot', date: '2026-11-03' }
];

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure dailyHistory has past 7 days initialized if empty
      if (!parsed.dailyHistory || parsed.dailyHistory.length === 0) {
        parsed.dailyHistory = generateInitial7Days();
      }
      return parsed;
    }
  } catch {
    // fallback
  }

  const initialStats: UserStats = {
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    highestStreak: 0,
    highestScore: 0,
    averageResponseMs: 1850,
    operationsBreakdown: {
      add: { total: 0, correct: 0 },
      sub: { total: 0, correct: 0 },
      mul: { total: 0, correct: 0 },
      div: { total: 0, correct: 0 }
    },
    dailyHistory: generateInitial7Days(),
    streakDays: 1,
    lastPlayedDate: new Date().toISOString().split('T')[0],
    dailyReminderEnabled: true,
    dailyReminderTime: '19:00'
  };

  saveUserStats(initialStats);
  return initialStats;
}

export function saveUserStats(stats: UserStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats', err);
  }
}

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (raw) {
      const saved: Achievement[] = JSON.parse(raw);
      // Merge with any new achievements defined in code
      return DEFAULT_ACHIEVEMENTS.map(def => {
        const found = saved.find(s => s.id === def.id);
        return found ? { ...def, ...found } : def;
      });
    }
  } catch {
    // fallback
  }
  return DEFAULT_ACHIEVEMENTS;
}

export function saveAchievements(list: Achievement[]) {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save achievements', err);
  }
}

export function loadCustomization(): PlayerCustomization {
  try {
    const raw = localStorage.getItem(CUSTOMIZATION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_CUSTOMIZATION;
}

export function saveCustomization(custom: PlayerCustomization) {
  try {
    localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(custom));
  } catch (err) {
    console.error('Failed to save customization', err);
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_LEADERBOARD;
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry[] {
  const current = loadLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `user_lb_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    isUser: true
  };
  const updated = [...current, newEntry].sort((a, b) => b.score - a.score).slice(0, 30);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

function generateInitial7Days(): DailyActivity[] {
  const list: DailyActivity[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    // Populate with slight realistic warmup data for days 6 to 1, today starts fresh
    const isPast = i > 0;
    list.push({
      date: dateStr,
      questionsSolved: isPast ? 10 + (6 - i) * 3 : 0,
      correctCount: isPast ? 9 + (6 - i) * 3 : 0,
      gamesPlayed: isPast ? 1 + (6 - i) : 0,
      avgTimeMs: isPast ? 2200 - (6 - i) * 80 : 0,
      scoreEarned: isPast ? 700 + (6 - i) * 150 : 0
    });
  }
  return list;
}

/**
 * Record a game session results into stats, achievements, and daily history
 */
export function recordGameSession(params: {
  won: boolean;
  score: number;
  totalQuestions: number;
  correctCount: number;
  maxStreak: number;
  avgTimeMs: number;
  operations: { [op: string]: { total: number; correct: number } };
  mode: GameMode;
  difficulty?: AIDifficulty;
  playerName: string;
  avatar: string;
  isDarkMode: boolean;
  ropeDominance: number; // 0 to 1, 1 means never lost ground
}) {
  const stats = loadUserStats();
  const todayStr = new Date().toISOString().split('T')[0];

  // Daily streak check
  if (stats.lastPlayedDate !== todayStr) {
    const lastDate = new Date(stats.lastPlayedDate);
    const currentDate = new Date(todayStr);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      stats.streakDays += 1;
    } else if (diffDays > 1) {
      stats.streakDays = 1;
    }
    stats.lastPlayedDate = todayStr;
  }

  stats.totalGames += 1;
  if (params.won) stats.totalWins += 1;
  else stats.totalLosses += 1;

  stats.totalQuestions += params.totalQuestions;
  stats.totalCorrect += params.correctCount;
  if (params.maxStreak > stats.highestStreak) {
    stats.highestStreak = params.maxStreak;
  }
  if (params.score > stats.highestScore) {
    stats.highestScore = params.score;
  }

  // Update operations breakdown
  if (params.operations['+']) {
    stats.operationsBreakdown.add.total += params.operations['+'].total;
    stats.operationsBreakdown.add.correct += params.operations['+'].correct;
  }
  if (params.operations['-']) {
    stats.operationsBreakdown.sub.total += params.operations['-'].total;
    stats.operationsBreakdown.sub.correct += params.operations['-'].correct;
  }
  if (params.operations['×']) {
    stats.operationsBreakdown.mul.total += params.operations['×'].total;
    stats.operationsBreakdown.mul.correct += params.operations['×'].correct;
  }
  if (params.operations['÷']) {
    stats.operationsBreakdown.div.total += params.operations['÷'].total;
    stats.operationsBreakdown.div.correct += params.operations['÷'].correct;
  }

  // Update daily activity
  let todayEntry = stats.dailyHistory.find(d => d.date === todayStr);
  if (!todayEntry) {
    todayEntry = {
      date: todayStr,
      questionsSolved: 0,
      correctCount: 0,
      gamesPlayed: 0,
      avgTimeMs: 0,
      scoreEarned: 0
    };
    stats.dailyHistory.push(todayEntry);
    if (stats.dailyHistory.length > 7) {
      stats.dailyHistory.shift();
    }
  }

  todayEntry.gamesPlayed += 1;
  todayEntry.questionsSolved += params.totalQuestions;
  todayEntry.correctCount += params.correctCount;
  todayEntry.scoreEarned += params.score;
  todayEntry.avgTimeMs = Math.round(
    todayEntry.avgTimeMs === 0 ? params.avgTimeMs : (todayEntry.avgTimeMs + params.avgTimeMs) / 2
  );

  saveUserStats(stats);

  // Check and unlock achievements
  const achievements = loadAchievements();
  const newlyUnlocked: Achievement[] = [];

  const updateAch = (id: string, progressValue: number) => {
    const ach = achievements.find(a => a.id === id);
    if (ach && !ach.unlocked) {
      ach.progress = Math.min(ach.maxProgress, Math.max(ach.progress, progressValue));
      if (ach.progress >= ach.maxProgress) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        newlyUnlocked.push(ach);
      }
    }
  };

  updateAch('first_game', 1);
  updateAch('streak_5', params.maxStreak);
  updateAch('streak_10', params.maxStreak);
  if (params.avgTimeMs < 2000 && params.correctCount > 0) updateAch('speed_answer', 1);
  if (params.won && (params.difficulty === 'HARD' || params.difficulty === 'GENIUS')) {
    updateAch('beat_ai_hard', 1);
  }
  if (params.mode === 'LOCAL_2P') updateAch('play_local_2p', 1);
  if (params.mode === 'TIME_ATTACK') updateAch('time_attack_score', params.score);
  updateAch('solve_50', stats.totalCorrect);
  updateAch('solve_100', stats.totalCorrect);
  updateAch('streak_3_days', stats.streakDays);
  if (params.isDarkMode) updateAch('dark_mode_night', 1);
  if (params.won && params.ropeDominance >= 0.8) updateAch('perfect_win', 1);

  saveAchievements(achievements);

  // Auto record on global leaderboard if high score
  if (params.score > 500) {
    const accuracy = params.totalQuestions > 0 ? Math.round((params.correctCount / params.totalQuestions) * 100) : 100;
    addLeaderboardEntry({
      playerName: params.playerName,
      score: params.score,
      mode: params.mode,
      difficulty: params.difficulty,
      accuracy,
      streak: params.maxStreak,
      avatar: params.avatar
    });
  }

  return { newlyUnlocked, stats };
}

/**
 * Cloud Sync String Generator (base64 JSON)
 */
export function exportCloudSyncData(): string {
  const stats = loadUserStats();
  const achievements = loadAchievements();
  const custom = loadCustomization();
  const data = {
    stats,
    achievements,
    custom,
    timestamp: Date.now(),
    app: 'tarik_tambang_matematika'
  };
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function importCloudSyncData(code: string): { success: boolean; message: string } {
  try {
    const jsonStr = decodeURIComponent(atob(code.trim()));
    const data = JSON.parse(jsonStr);
    if (data.app !== 'tarik_tambang_matematika' || !data.stats) {
      return { success: false, message: 'Format kode sinkronisasi tidak valid!' };
    }
    saveUserStats(data.stats);
    if (data.achievements) saveAchievements(data.achievements);
    if (data.custom) saveCustomization(data.custom);
    return { success: true, message: 'Data progres berhasil disinkronkan!' };
  } catch {
    return { success: false, message: 'Gagal mengimpor kode. Pastikan kode benar.' };
  }
}
