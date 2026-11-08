export type GameMode = 'SINGLE_AI' | 'LOCAL_2P' | 'TIME_ATTACK';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'GENIUS';

export type OperationType = 'ADD' | 'SUB' | 'MUL' | 'DIV' | 'MIXED';

export interface MathQuestion {
  id: string;
  num1: number;
  num2: number;
  operation: '+' | '-' | '×' | '÷';
  expression: string; // e.g. "14 + 8 = ?"
  correctAnswer: number;
  options: number[]; // 4 choices for fast 1-tap answering
}

export interface PlayerCustomization {
  nickname: string;
  gender: 'boy' | 'girl' | 'mascot';
  headbandColor: string; // 'blue' | 'red' | 'gold' | 'black' | 'purple'
  outfitColor: string;
  teamIcon: 'lion' | 'eagle' | 'tiger' | 'dragon';
  title: string;
}

export interface TeamState {
  name: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  currentStreak: number;
  pullPower: number; // transient boost
  lastAnswerTime?: number;
  customization: PlayerCustomization;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'streak' | 'games';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  rewardTitle?: string;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  mode: GameMode;
  difficulty?: AIDifficulty;
  accuracy: number;
  streak: number;
  avatar: string;
  date: string;
  isUser?: boolean;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  questionsSolved: number;
  correctCount: number;
  gamesPlayed: number;
  avgTimeMs: number;
  scoreEarned: number;
}

export interface UserStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  totalQuestions: number;
  totalCorrect: number;
  highestStreak: number;
  highestScore: number;
  averageResponseMs: number;
  operationsBreakdown: {
    add: { total: number; correct: number };
    sub: { total: number; correct: number };
    mul: { total: number; correct: number };
    div: { total: number; correct: number };
  };
  dailyHistory: DailyActivity[];
  streakDays: number;
  lastPlayedDate: string;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // e.g. "19:00"
}
