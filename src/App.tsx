import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, AIDifficulty, OperationType, MathQuestion, PlayerCustomization } from './types/game';
import { generateQuestion } from './utils/mathGenerator';
import { sound } from './utils/audio';
import {
  loadCustomization,
  recordGameSession
} from './utils/storage';
import { ScoreHeader } from './components/ScoreHeader';
import { MathBoard } from './components/MathBoard';
import { TugOfWarArena } from './components/TugOfWarArena';
import { AnswerPad } from './components/AnswerPad';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AchievementsModal } from './components/AchievementsModal';
import { DailyStatsModal } from './components/DailyStatsModal';
import { CustomizationModal } from './components/CustomizationModal';
import { DailyReminderModal } from './components/DailyReminderModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { GameOverModal } from './components/GameOverModal';

export default function App() {
  // Theme & Sound state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Navigation Modals
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDailyStats, setShowDailyStats] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showCloudSync, setShowCloudSync] = useState(false);

  // Player Profile
  const [customization, setCustomization] = useState<PlayerCustomization>(loadCustomization());

  // Game Settings
  const [gameMode, setGameMode] = useState<GameMode>('SINGLE_AI');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('MEDIUM');
  const [allowedOps, setAllowedOps] = useState<OperationType>('MIXED');

  // Game State Machine: 'TITLE_MENU' | 'PLAYING' | 'GAME_OVER'
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'GAME_OVER'>('TITLE_MENU');

  // Active Match State
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [ropeOffset, setRopeOffset] = useState(0); // -100 to +100
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState(1);

  // Scores & Counters
  const [blueScore, setBlueScore] = useState(0);
  const [blueCorrect, setBlueCorrect] = useState(0);
  const [blueStreak, setBlueStreak] = useState(0);
  const [blueMaxStreak, setBlueMaxStreak] = useState(0);
  const [bluePulling, setBluePulling] = useState(false);

  const [redScore, setRedScore] = useState(0);
  const [redCorrect, setRedCorrect] = useState(0);
  const [redStreak, setRedStreak] = useState(0);
  const [redMaxStreak, setRedMaxStreak] = useState(0);
  const [redPulling, setRedPulling] = useState(false);

  const [lastPullTeam, setLastPullTeam] = useState<'blue' | 'red' | null>(null);
  const [winner, setWinner] = useState<'blue' | 'red' | 'draw'>('draw');

  // Analytics for the session
  const sessionStatsRef = useRef({
    totalQuestions: 0,
    startTime: 0,
    opsBreakdown: {
      '+': { total: 0, correct: 0 },
      '-': { total: 0, correct: 0 },
      '×': { total: 0, correct: 0 },
      '÷': { total: 0, correct: 0 }
    } as Record<string, { total: number; correct: number }>,
    minRopeOffset: 0,
    maxRopeOffset: 0
  });

  const questionStartTimeRef = useRef<number>(Date.now());
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Apply dark class to documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    sound.playClick();
  };

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // Start new round / match
  const startGame = useCallback((modeToStart: GameMode = gameMode) => {
    sound.playWhistle();
    setGameMode(modeToStart);
    setGameState('PLAYING');
    setRound(1);
    setTimeLeft(modeToStart === 'TIME_ATTACK' ? 60 : 30);
    setRopeOffset(0);
    setBlueScore(0);
    setBlueCorrect(0);
    setBlueStreak(0);
    setBlueMaxStreak(0);
    setRedScore(0);
    setRedCorrect(0);
    setRedStreak(0);
    setRedMaxStreak(0);
    setDifficultyLevel(1);
    setWinner('draw');
    setLastPullTeam(null);

    sessionStatsRef.current = {
      totalQuestions: 0,
      startTime: Date.now(),
      opsBreakdown: {
        '+': { total: 0, correct: 0 },
        '-': { total: 0, correct: 0 },
        '×': { total: 0, correct: 0 },
        '÷': { total: 0, correct: 0 }
      },
      minRopeOffset: 0,
      maxRopeOffset: 0
    };

    const firstQ = generateQuestion(1, allowedOps);
    setQuestion(firstQ);
    questionStartTimeRef.current = Date.now();
  }, [gameMode, allowedOps]);

  // Finish match / GameOver
  const finishMatch = useCallback((resolvedWinner?: 'blue' | 'red' | 'draw') => {
    let finalWinner = resolvedWinner;
    if (!finalWinner) {
      if (ropeOffset <= -10) finalWinner = 'blue';
      else if (ropeOffset >= 10) finalWinner = 'red';
      else if (blueScore > redScore) finalWinner = 'blue';
      else if (redScore > blueScore) finalWinner = 'red';
      else finalWinner = 'draw';
    }

    setWinner(finalWinner);
    setGameState('GAME_OVER');

    if (finalWinner === 'blue') {
      sound.playVictory();
    } else {
      sound.playWhistle();
    }

    // Record stats
    const durationMs = Math.max(1000, Date.now() - sessionStatsRef.current.startTime);
    const avgMs = Math.round(durationMs / Math.max(1, sessionStatsRef.current.totalQuestions));

    // Rope dominance: did blue keep rope entirely in its territory?
    const dominance = sessionStatsRef.current.maxRopeOffset <= 10 ? 1 : 0.5;

    recordGameSession({
      won: finalWinner === 'blue',
      score: blueScore,
      totalQuestions: sessionStatsRef.current.totalQuestions,
      correctCount: blueCorrect,
      maxStreak: blueMaxStreak,
      avgTimeMs: avgMs,
      operations: sessionStatsRef.current.opsBreakdown,
      mode: gameMode,
      difficulty: aiDifficulty,
      playerName: customization.nickname || 'Jagoan Angka',
      avatar: customization.gender,
      isDarkMode,
      ropeDominance: dominance
    });
  }, [ropeOffset, blueScore, redScore, blueCorrect, blueMaxStreak, gameMode, aiDifficulty, customization, isDarkMode]);

  // Main countdown game loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishMatch();
          return 0;
        }

        // Ticking audio
        if (prev <= 5) {
          sound.playTick(true);
        } else if (prev % 5 === 0) {
          sound.playTick(false);
        }

        // Dynamic difficulty progression as duration ticks
        const elapsed = 30 - prev;
        if (elapsed > 10 && elapsed <= 20) setDifficultyLevel(2);
        else if (elapsed > 20) setDifficultyLevel(3);

        // Time attack mechanics: slight constant rope drift toward red to create tension
        if (gameMode === 'TIME_ATTACK') {
          setRopeOffset(curr => {
            const next = Math.min(100, curr + 0.8);
            if (next >= 100) {
              clearInterval(timer);
              finishMatch('red');
            }
            return next;
          });
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, gameMode, finishMatch]);

  // Check victory boundary condition on rope offset change
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    if (ropeOffset <= sessionStatsRef.current.minRopeOffset) {
      sessionStatsRef.current.minRopeOffset = ropeOffset;
    }
    if (ropeOffset >= sessionStatsRef.current.maxRopeOffset) {
      sessionStatsRef.current.maxRopeOffset = ropeOffset;
    }

    if (ropeOffset <= -100) {
      finishMatch('blue');
    } else if (ropeOffset >= 100) {
      finishMatch('red');
    }
  }, [ropeOffset, gameState, finishMatch]);

  // Next Question Generator helper
  const nextQuestion = useCallback(() => {
    const nextQ = generateQuestion(difficultyLevel, allowedOps);
    setQuestion(nextQ);
    questionStartTimeRef.current = Date.now();
  }, [difficultyLevel, allowedOps]);

  // AI Opponent Logic for Single Player mode
  useEffect(() => {
    if (gameState !== 'PLAYING' || gameMode !== 'SINGLE_AI' || !question) return;

    // AI response speed and accuracy based on chosen difficulty
    let delayMin = 2200;
    let delayMax = 3800;
    let accuracyRate = 0.75;

    if (aiDifficulty === 'EASY') {
      delayMin = 2600;
      delayMax = 4500;
      accuracyRate = 0.60;
    } else if (aiDifficulty === 'MEDIUM') {
      delayMin = 1800;
      delayMax = 3200;
      accuracyRate = 0.80;
    } else if (aiDifficulty === 'HARD') {
      delayMin = 1200;
      delayMax = 2200;
      accuracyRate = 0.90;
    } else if (aiDifficulty === 'GENIUS') {
      delayMin = 800;
      delayMax = 1500;
      accuracyRate = 0.98;
    }

    const randomDelay = Math.floor(Math.random() * (delayMax - delayMin)) + delayMin;

    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    aiTimerRef.current = setTimeout(() => {
      if (gameState !== 'PLAYING') return;

      const isCorrect = Math.random() < accuracyRate;
      let aiAns = question.correctAnswer;
      if (!isCorrect) {
        const wrongOpts = question.options.filter(o => o !== question.correctAnswer);
        aiAns = wrongOpts[Math.floor(Math.random() * wrongOpts.length)] || question.correctAnswer + 2;
      }

      handleAnswer('red', aiAns);
    }, randomDelay);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [question, gameState, gameMode, aiDifficulty]);

  // Handle Answer Submission (from Blue or Red)
  const handleAnswer = (team: 'blue' | 'red', answerVal: number) => {
    if (!question || gameState !== 'PLAYING') return;

    const isCorrect = answerVal === question.correctAnswer;
    const op = question.operation;

    // Track analytics
    sessionStatsRef.current.totalQuestions += 1;
    if (sessionStatsRef.current.opsBreakdown[op]) {
      sessionStatsRef.current.opsBreakdown[op].total += 1;
      if (isCorrect) sessionStatsRef.current.opsBreakdown[op].correct += 1;
    }

    if (team === 'blue') {
      if (isCorrect) {
        sound.playCorrect();
        sound.playRopePull();
        setBluePulling(true);
        setTimeout(() => setBluePulling(false), 300);

        const newStreak = blueStreak + 1;
        setBlueStreak(newStreak);
        if (newStreak > blueMaxStreak) setBlueMaxStreak(newStreak);

        // Power calculation: base pull (16) + streak bonus (up to 10)
        const pullAmount = 16 + Math.min(10, newStreak * 2);
        setRopeOffset(curr => Math.max(-100, curr - pullAmount));
        setBlueScore(prev => prev + 100 + newStreak * 20);
        setBlueCorrect(prev => prev + 1);
        setLastPullTeam('blue');

        // Time Attack bonus seconds
        if (gameMode === 'TIME_ATTACK') {
          setTimeLeft(t => Math.min(90, t + 2));
        }

        nextQuestion();
      } else {
        sound.playWrong();
        setBlueStreak(0);
        // Penalty: small rope drift to opponent
        setRopeOffset(curr => Math.min(100, curr + 6));
      }
    } else {
      // Red Team
      if (isCorrect) {
        sound.playRopePull();
        setRedPulling(true);
        setTimeout(() => setRedPulling(false), 300);

        const newStreak = redStreak + 1;
        setRedStreak(newStreak);
        if (newStreak > redMaxStreak) setRedMaxStreak(newStreak);

        const pullAmount = 16 + Math.min(10, newStreak * 2);
        setRopeOffset(curr => Math.min(100, curr + pullAmount));
        setRedScore(prev => prev + 100 + newStreak * 20);
        setRedCorrect(prev => prev + 1);
        setLastPullTeam('red');

        // In 2P local mode, opponent winning the question progresses the board
        if (gameMode === 'LOCAL_2P') {
          nextQuestion();
        }
      } else {
        sound.playWrong();
        setRedStreak(0);
        setRopeOffset(curr => Math.max(-100, curr - 6));
      }
    }
  };

  // Keyboard controls listener
  useEffect(() => {
    if (gameState !== 'PLAYING' || !question) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key;
      // Blue Team Hotkeys: '1', '2', '3', '4' or 'q', 'w', 'e', 'r'
      const blueKeys = ['1', '2', '3', '4', 'q', 'w', 'e', 'r'];
      const blueIdx = blueKeys.indexOf(key.toLowerCase());
      if (blueIdx !== -1) {
        const optionIdx = blueIdx % 4;
        if (question.options[optionIdx] !== undefined) {
          handleAnswer('blue', question.options[optionIdx]);
        }
      }

      // Red Team Hotkeys (in 2P Local Mode): '7', '8', '9', '0' or 'u', 'i', 'o', 'p'
      if (gameMode === 'LOCAL_2P') {
        const redKeys = ['7', '8', '9', '0', 'u', 'i', 'o', 'p'];
        const redIdx = redKeys.indexOf(key.toLowerCase());
        if (redIdx !== -1) {
          const optionIdx = redIdx % 4;
          if (question.options[optionIdx] !== undefined) {
            handleAnswer('red', question.options[optionIdx]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, question, gameMode]);

  return (
    <div className="min-h-screen bg-amber-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 3-ZONE TOP BAR CONTRACT */}
      <header className="flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5 border-b border-amber-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            setGameState('TITLE_MENU');
          }}
          className="text-lg sm:text-xl font-game font-black tracking-tight text-amber-950 dark:text-amber-400 whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity cursor-pointer flex items-center gap-2"
        >
          <span>🪢</span>
          <span>Tarik Tambang Matematika</span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700 dark:text-slate-300">
          <button
            onClick={() => {
              sound.playClick();
              setShowDailyStats(true);
            }}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>📊</span> Statistik
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setShowLeaderboard(true);
            }}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>🏆</span> Papan Skor
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setShowAchievements(true);
            }}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>🎖️</span> Pencapaian
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setShowCustomization(true);
            }}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>🎨</span> Karakter
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setShowReminder(true);
            }}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>⏰</span> Pengingat
          </button>
        </nav>

        {/* Zone 3: 1 primary action or utility cluster */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Cloud Sync Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowCloudSync(true);
            }}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Sinkronisasi Cloud"
          >
            <span className="text-lg">☁️</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
          >
            <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? 'Mode Siang' : 'Mode Malam (Gelap)'}
          >
            <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
          </button>

          {gameState === 'PLAYING' ? (
            <button
              onClick={() => {
                sound.playClick();
                setGameState('TITLE_MENU');
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-800 dark:bg-slate-700 rounded-xl hover:bg-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Menu
            </button>
          ) : (
            <button
              onClick={() => startGame()}
              className="px-4 py-2 text-xs font-game font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              Mainkan Game
            </button>
          )}
        </div>
      </header>

      {/* MOBILE SECONDARY NAV STRIP */}
      <div className="lg:hidden flex items-center justify-around py-2 px-3 bg-amber-100/70 dark:bg-slate-900 border-b border-amber-200 dark:border-slate-800 text-xs font-bold">
        <button onClick={() => setShowDailyStats(true)} className="flex items-center gap-1 cursor-pointer">
          📊 Statistik
        </button>
        <button onClick={() => setShowLeaderboard(true)} className="flex items-center gap-1 cursor-pointer">
          🏆 Skor
        </button>
        <button onClick={() => setShowAchievements(true)} className="flex items-center gap-1 cursor-pointer">
          🎖️ Prestasi
        </button>
        <button onClick={() => setShowCustomization(true)} className="flex items-center gap-1 cursor-pointer">
          🎨 Karakter
        </button>
        <button onClick={() => setShowReminder(true)} className="flex items-center gap-1 cursor-pointer">
          ⏰ Pengingat
        </button>
      </div>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 w-full max-w-6xl mx-auto">
        {gameState === 'TITLE_MENU' ? (
          /* ================= TITLE & SETUP MENU ================= */
          <div className="w-full max-w-3xl flex flex-col items-center text-center space-y-6 py-6 animate-fadeIn">
            {/* Title Lockup */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-200/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold text-xs sm:text-sm">
                <span>🔥</span> Game Tarik Tambang Hitung Cepat 2D
              </div>
              <h1 className="font-game font-black text-4xl sm:text-6xl text-amber-950 dark:text-amber-400 tracking-tight text-wrap-balance">
                Tarik Tambang Matematika
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                Adu kekuatan tarikan dengan menjawab perhitungan matematika secepat kilat! Setiap jawaban benar menambah tarikan timmu!
              </p>
            </div>

            {/* Customization Badge */}
            <div
              onClick={() => setShowCustomization(true)}
              className="p-3 bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-300 dark:border-slate-700 shadow-md flex items-center gap-3 cursor-pointer hover:border-amber-500 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-3xl border border-blue-300">
                {customization.gender === 'girl' ? '👧' : customization.gender === 'mascot' ? '🦁' : '👦'}
              </div>
              <div className="text-left">
                <div className="font-game font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-amber-600 transition-colors">
                  {customization.nickname} · <span className="text-xs text-amber-600 dark:text-amber-400">{customization.title}</span>
                </div>
                <div className="text-xs text-slate-400">Klik untuk mengganti avatar & gaya</div>
              </div>
              <span className="text-amber-600 font-bold text-xs ml-2">Ubah ✏️</span>
            </div>

            {/* GAME MODE SELECTION */}
            <div className="w-full space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pilih Mode Permainan
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Mode 1: Lawan AI */}
                <div
                  onClick={() => setGameMode('SINGLE_AI')}
                  className={`p-4 rounded-2xl border-3 text-left transition-all cursor-pointer ${
                    gameMode === 'SINGLE_AI'
                      ? 'border-amber-500 bg-amber-50 dark:bg-slate-800/90 shadow-md scale-[1.02]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300'
                  }`}
                >
                  <div className="text-3xl mb-1">🤖</div>
                  <h3 className="font-game font-bold text-base text-slate-900 dark:text-slate-100">
                    Lawan Komputer
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Uji kecepatan berhitungmu melawan AI bot dengan kecerdasan dinamis.
                  </p>

                  {/* Difficulty Sub-selector */}
                  {gameMode === 'SINGLE_AI' && (
                    <div className="mt-3 pt-2 border-t border-amber-200 dark:border-slate-700 flex gap-1">
                      {(['EASY', 'MEDIUM', 'HARD', 'GENIUS'] as AIDifficulty[]).map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setAiDifficulty(d);
                          }}
                          className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${
                            aiDifficulty === d
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-amber-200/50 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {d === 'EASY' ? 'Pemula' : d === 'MEDIUM' ? 'Sedang' : d === 'HARD' ? 'Jagoan' : 'Genius'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mode 2: 2 Pemain Lokal */}
                <div
                  onClick={() => setGameMode('LOCAL_2P')}
                  className={`p-4 rounded-2xl border-3 text-left transition-all cursor-pointer ${
                    gameMode === 'LOCAL_2P'
                      ? 'border-amber-500 bg-amber-50 dark:bg-slate-800/90 shadow-md scale-[1.02]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300'
                  }`}
                >
                  <div className="text-3xl mb-1">👥</div>
                  <h3 className="font-game font-bold text-base text-slate-900 dark:text-slate-100">
                    2 Pemain Lokal
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Main bersama teman dalam satu layar! Tim Biru (Kiri) vs Tim Merah (Kanan).
                  </p>
                  <div className="mt-2 text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                    Kontrol layar sentuh & tombol keyboard terpisah!
                  </div>
                </div>

                {/* Mode 3: Tantangan Waktu */}
                <div
                  onClick={() => setGameMode('TIME_ATTACK')}
                  className={`p-4 rounded-2xl border-3 text-left transition-all cursor-pointer ${
                    gameMode === 'TIME_ATTACK'
                      ? 'border-amber-500 bg-amber-50 dark:bg-slate-800/90 shadow-md scale-[1.02]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300'
                  }`}
                >
                  <div className="text-3xl mb-1">⏳</div>
                  <h3 className="font-game font-bold text-base text-slate-900 dark:text-slate-100">
                    Tantangan Waktu
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Uji ketepatan & kecepatan murni dalam 60 detik melawan tarikan tambang otomatis!
                  </p>
                  <div className="mt-2 text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                    Dapatkan bonus detik setiap jawaban tepat!
                  </div>
                </div>
              </div>
            </div>

            {/* OPERATION FILTER */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Operasi Hitung:</span>
              <div className="flex bg-amber-100 dark:bg-slate-800 p-1 rounded-xl gap-1 text-xs font-bold">
                {[
                  { id: 'MIXED', label: 'Campuran (+ - × ÷)' },
                  { id: 'ADD', label: 'Tambah (+)' },
                  { id: 'SUB', label: 'Kurang (-)' },
                  { id: 'MUL', label: 'Kali (×)' },
                  { id: 'DIV', label: 'Bagi (÷)' }
                ].map(opItem => (
                  <button
                    key={opItem.id}
                    type="button"
                    onClick={() => setAllowedOps(opItem.id as OperationType)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      allowedOps === opItem.id
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-amber-200/50'
                    }`}
                  >
                    {opItem.label}
                  </button>
                ))}
              </div>
            </div>

            {/* BIG JUMP-IN BUTTON */}
            <button
              type="button"
              onClick={() => startGame()}
              className="w-full max-w-md py-4 px-8 bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-game font-black text-2xl rounded-3xl shadow-xl hover:shadow-2xl transform active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-3 border-4 border-yellow-300"
            >
              <span>Mulai Bertanding!</span>
              <span className="text-3xl">🪢</span>
            </button>
          </div>
        ) : (
          /* ================= ACTIVE PLAYING ARENA ================= */
          <div className="w-full flex flex-col items-center space-y-2 animate-fadeIn">
            {/* Top Wooden Banner & Team Scores */}
            <ScoreHeader
              round={round}
              timeLeft={timeLeft}
              blueScore={blueScore}
              blueCorrect={blueCorrect}
              redScore={redScore}
              redCorrect={redCorrect}
              blueCustom={customization}
              redCustom={{
                nickname: gameMode === 'LOCAL_2P' ? 'Pemain 2' : `AI ${aiDifficulty}`,
                gender: 'girl',
                headbandColor: 'red',
                outfitColor: 'red',
                teamIcon: 'tiger',
                title: 'Penantang Merah'
              }}
              mode={gameMode}
            />

            {/* Central Hanging Math Board */}
            <MathBoard question={question} difficultyLevel={difficultyLevel} />

            {/* 2D Tug of War Animated Arena with Characters & Rope */}
            <TugOfWarArena
              ropeOffset={ropeOffset}
              bluePulling={bluePulling}
              redPulling={redPulling}
              blueCustom={customization}
              redCustom={{
                nickname: 'TIM MERAH',
                gender: 'girl',
                headbandColor: 'red',
                outfitColor: 'red',
                teamIcon: 'tiger',
                title: 'Penantang Merah'
              }}
              isDarkMode={isDarkMode}
              lastPullTeam={lastPullTeam}
            />

            {/* Bottom Controls / Answer Pads */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {/* TIM BIRU ANSWER PAD (Player 1) */}
              <AnswerPad
                team="blue"
                label="Jawaban Tim Biru:"
                question={question}
                onAnswer={ans => handleAnswer('blue', ans)}
                disabled={gameState !== 'PLAYING'}
                hotkeys={['1', '2', '3', '4']}
              />

              {/* TIM MERAH ANSWER PAD (Player 2 or AI) */}
              <AnswerPad
                team="red"
                label="Jawaban Tim Merah:"
                question={question}
                onAnswer={ans => handleAnswer('red', ans)}
                disabled={gameState !== 'PLAYING'}
                hotkeys={['7', '8', '9', '0']}
                isAiControlled={gameMode === 'SINGLE_AI'}
              />
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-3 px-6 border-t border-amber-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span>Tarik Tambang Matematika © 2026 · Asah Kecepatan & Ketepatan Berhitung</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <button onClick={() => setShowDailyStats(true)} className="hover:underline cursor-pointer">
            Statistik Perkembangan
          </button>
          <span>·</span>
          <button onClick={() => setShowLeaderboard(true)} className="hover:underline cursor-pointer">
            Papan Skor Global
          </button>
          <span>·</span>
          <button onClick={() => setShowAchievements(true)} className="hover:underline cursor-pointer">
            12 Pencapaian
          </button>
        </div>
      </footer>

      {/* MODALS */}
      <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} />
      <DailyStatsModal isOpen={showDailyStats} onClose={() => setShowDailyStats(false)} />
      <CustomizationModal
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
        currentCustom={customization}
        onSave={newCustom => setCustomization(newCustom)}
      />
      <DailyReminderModal isOpen={showReminder} onClose={() => setShowReminder(false)} />
      <CloudSyncModal
        isOpen={showCloudSync}
        onClose={() => setShowCloudSync(false)}
        onSyncSuccess={() => {
          setCustomization(loadCustomization());
        }}
      />
      <GameOverModal
        isOpen={gameState === 'GAME_OVER'}
        winner={winner}
        blueScore={blueScore}
        blueCorrect={blueCorrect}
        redScore={redScore}
        redCorrect={redCorrect}
        mode={gameMode}
        onPlayAgain={() => startGame()}
        onGoToMenu={() => setGameState('TITLE_MENU')}
        userTeam="blue"
      />
    </div>
  );
}
