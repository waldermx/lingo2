export interface Character {
  id: string;
  character: string;
  pinyin: string;
  definition: string;
  strokeOrder?: number[];
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  correctCount: number;
}

export interface FlashcardState {
  currentCharacter: Character;
  showAnswer: boolean;
  isCorrect: boolean;
  streak: number;
  sessionProgress: number;
}

export type FlashcardAction = 
  | { type: 'MARK_CORRECT' }
  | { type: 'MARK_REPEAT' }
  | { type: 'NEXT_CHARACTER'; payload: Character }
  | { type: 'TOGGLE_ANSWER' };