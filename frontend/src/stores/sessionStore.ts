import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type GameMode = 'time-attack' | 'bomb-mode' | 'flashcard' | 'quiz';
export type InputMode = 'draw' | 'choice';

export interface SessionCharacter {
  id: string;
  character: string;
  pinyin: string;
  definition: string;
  choices?: string[]; // for multiple choice mode (4 pinyin options)
}

interface SessionState {
  mode: GameMode | null;
  inputMode: InputMode;
  isActive: boolean;
  isPaused: boolean;

  // Time
  elapsedMs: number;
  limitMs: number | null; // null = no limit (flashcard mode)

  // Score
  score: number;
  combo: number;
  maxCombo: number;
  correct: number;
  incorrect: number;

  // Queue
  queue: SessionCharacter[];
  currentIndex: number;

  // Game-specific
  bombFuseMs: number; // Bomb mode: remaining fuse time
  hasExploded: boolean;
  personalBests: Record<GameMode, number>;
}

interface SessionActions {
  startSession(mode: GameMode, inputMode: InputMode, queue: SessionCharacter[], limitMs?: number): void;
  pauseSession(): void;
  resumeSession(): void;
  endSession(): void;
  recordCorrect(): void;
  recordIncorrect(): void;
  nextCharacter(): void;
  tickTimer(deltaMs: number): void;
  explodeBomb(): void;
  addBombFuse(ms: number): void;
  setInputMode(mode: InputMode): void;
  updatePersonalBest(mode: GameMode, score: number): void;
}

const INITIAL_SESSION: SessionState = {
  mode: null,
  inputMode: 'choice',
  isActive: false,
  isPaused: false,
  elapsedMs: 0,
  limitMs: null,
  score: 0,
  combo: 0,
  maxCombo: 0,
  correct: 0,
  incorrect: 0,
  queue: [],
  currentIndex: 0,
  bombFuseMs: 30000,
  hasExploded: false,
  personalBests: {
    'time-attack': 0,
    'bomb-mode': 0,
    'flashcard': 0,
    'quiz': 0,
  },
};

export const useSessionStore = create<SessionState & SessionActions>()(
  immer((set, get) => ({
    ...INITIAL_SESSION,

    startSession(mode, inputMode, queue, limitMs) {
      set((s) => {
        s.mode = mode;
        s.inputMode = inputMode;
        s.isActive = true;
        s.isPaused = false;
        s.elapsedMs = 0;
        s.limitMs = limitMs ?? null;
        s.score = 0;
        s.combo = 0;
        s.maxCombo = 0;
        s.correct = 0;
        s.incorrect = 0;
        s.queue = queue;
        s.currentIndex = 0;
        s.bombFuseMs = 30000;
        s.hasExploded = false;
      });
    },

    pauseSession() { set((s) => { s.isPaused = true; }); },
    resumeSession() { set((s) => { s.isPaused = false; }); },
    endSession() { set((s) => { s.isActive = false; }); },

    recordCorrect() {
      set((s) => {
        s.correct += 1;
        s.combo += 1;
        if (s.combo > s.maxCombo) s.maxCombo = s.combo;
        const multiplier = s.combo >= 5 ? 3 : s.combo >= 3 ? 2 : 1;
        s.score += 10 * multiplier;
        if (s.mode === 'bomb-mode') s.bombFuseMs += 5000;
      });
    },

    recordIncorrect() {
      set((s) => {
        s.incorrect += 1;
        s.combo = 0;
        if (s.mode === 'bomb-mode') get().explodeBomb();
      });
    },

    nextCharacter() {
      set((s) => {
        if (s.currentIndex < s.queue.length - 1) {
          s.currentIndex += 1;
        } else {
          // loop queue in games
          s.currentIndex = 0;
        }
      });
    },

    tickTimer(deltaMs) {
      set((s) => {
        if (!s.isActive || s.isPaused) return;
        s.elapsedMs += deltaMs;
        if (s.mode === 'time-attack' && s.limitMs != null) {
          // limitMs is the countdown value
          const remaining = s.limitMs - s.elapsedMs;
          if (remaining <= 0) s.isActive = false;
        }
        if (s.mode === 'bomb-mode') {
          s.bombFuseMs -= deltaMs;
          if (s.bombFuseMs <= 0) {
            s.bombFuseMs = 0;
            get().explodeBomb();
          }
        }
      });
    },

    explodeBomb() {
      set((s) => {
        s.hasExploded = true;
        s.isActive = false;
      });
    },

    addBombFuse(ms) {
      set((s) => { s.bombFuseMs += ms; });
    },

    setInputMode(mode) {
      set((s) => { s.inputMode = mode; });
    },

    updatePersonalBest(mode, score) {
      set((s) => {
        if (score > s.personalBests[mode]) s.personalBests[mode] = score;
      });
    },
  })),
);
