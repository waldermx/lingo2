// src/@types/hanzi-writer/index.d.ts
declare module 'hanzi-writer' {
  export interface HanziWriterOptions {
    width?: number;
    height?: number;
    padding?: number;
    showOutline?: boolean;
    showCharacter?: boolean;
    outlineColor?: string;
    strokeColor?: string;
    radicalColor?: string | null;
    strokeFadeDuration?: number;
    strokeHighlightSpeed?: number;
    drawingWidth?: number;
    strokeWidth?: number;
    drawingFadeDuration?: number;
    drawingColor?: string;
    showHintAfterMisses?: number;
    highlightOnComplete?: boolean;
    highlightColor?: string;
    delayBetweenStrokes?: number;
  }

  export interface QuizOptions {
    onMistake?: (strokeData: any) => void;
    onComplete?: (summary: any) => void;
  }

  export interface HanziWriterInstance {
    quiz: (options?: QuizOptions) => void;
    updateDimensions: (dimensions: { width: number; height: number }) => void;
    showCharacter: () => void;
    hideCharacter: () => void;
    animateCharacter: () => void;
    setCharacter: (character: string) => void;
  }

  interface HanziWriterStatic {
    create: (
      element: string | HTMLElement,
      character: string,
      options: HanziWriterOptions
    ) => HanziWriterInstance;
    
    loadCharacterData: (character: string) => Promise<any>;
  }

  const HanziWriter: HanziWriterStatic;
  export default HanziWriter;
}