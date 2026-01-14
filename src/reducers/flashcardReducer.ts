import { FlashcardState, FlashcardAction } from '../types/flashcard.types';

export const initialState: FlashcardState = {
  currentCharacter: {} as any,
  showAnswer: false,
  isCorrect: false,
  streak: 0,
  sessionProgress: 0
};

export const flashcardReducer = (
  state: FlashcardState,
  action: FlashcardAction
): FlashcardState => {
  switch (action.type) {
    case 'MARK_CORRECT':
      return {
        ...state,
        isCorrect: true,
        streak: state.streak + 1,
        sessionProgress: state.sessionProgress + 1
      };
      
    case 'MARK_REPEAT':
      return {
        ...state,
        isCorrect: false,
        streak: 0,
        showAnswer: true
      };
      
    case 'NEXT_CHARACTER':
      return {
        ...state,
        currentCharacter: action.payload,
        showAnswer: false,
        isCorrect: false
      };
      
    case 'TOGGLE_ANSWER':
      return {
        ...state,
        showAnswer: !state.showAnswer
      };
      
    default:
      return state;
  }
};