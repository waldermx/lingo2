// src/pages/PracticeQuizScreen.tsx — Redesigned
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import HanziWriter, { HanziWriterInstance } from 'hanzi-writer';
import charactersData from '../data/characters.json';
import { useUserStore } from '../stores/userStore';
import './PracticeQuizScreen.css';

interface Character {
  id: string;
  character: string;
  pinyin: string;
  definition: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  correctCount: number;
}

type InputMode = 'draw' | 'choice';

function buildChoices(chars: Character[], correctIdx: number): string[] {
  const correct = chars[correctIdx].pinyin;
  const pool = chars.filter((_, i) => i !== correctIdx).map((c) => c.pinyin);
  const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  const all = [...distractors, correct].sort(() => Math.random() - 0.5);
  return all;
}

const PracticeQuizScreen: React.FC = () => {
  const history = useHistory();
  const writerRef = useRef<HanziWriterInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [inputMode, setInputMode] = useState<InputMode | null>(null); // null = selection screen
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [, setResults] = useState<boolean[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [choiceResult, setChoiceResult] = useState<'correct' | 'wrong' | null>(null);

  const characters: Character[] = charactersData as Character[];
  const currentCharacter = characters[currentIndex];
  const { userId, incrementGuestReviews } = useUserStore();

  const advanceNext = useCallback((correct: boolean) => {
    if (!userId) incrementGuestReviews();
    setResults((prev) => {
      const newResults = [...prev, correct];
      setTimeout(() => {
        setCurrentIndex((idx) => {
          if (idx < characters.length - 1) {
            setShowHint(false);
            setChoiceResult(null);
            setChoices(inputMode === 'choice' ? buildChoices(characters, idx + 1) : []);
            return idx + 1;
          } else {
            history.push('/practice-results', { results: newResults });
            return idx;
          }
        });
      }, 700);
      return newResults;
    });
  }, [characters, history, inputMode, userId, incrementGuestReviews]);

  // Stable ref so the HanziWriter quiz callback never becomes stale
  const advanceNextRef = useRef(advanceNext);
  useEffect(() => { advanceNextRef.current = advanceNext; }, [advanceNext]);

  // Init choices when mode=choice
  useEffect(() => {
    if (inputMode === 'choice') setChoices(buildChoices(characters, currentIndex));
  }, [inputMode, currentIndex, characters]);

  // Init HanziWriter in draw mode — only re-runs when character or mode changes
  useEffect(() => {
    if (inputMode !== 'draw' || !containerRef.current || !currentCharacter) return;
    const container = containerRef.current;
    while (container.firstChild) container.removeChild(container.firstChild);

    writerRef.current = HanziWriter.create(container, currentCharacter.character, {
      width: 260,
      height: 260,
      padding: 8,
      showOutline: false,
      showCharacter: false,
      outlineColor: 'var(--c-bg-tertiary)',
      strokeColor: 'var(--c-text)',
      drawingColor: 'var(--c-blue)',
      drawingWidth: 30,
      strokeWidth: 4,
      showHintAfterMisses: 2,
      highlightOnComplete: true,
      highlightColor: 'var(--c-green)',
      strokeAnimationSpeed: 1.5,
      delayBetweenStrokes: 400,
    });

    writerRef.current.quiz({
      onMistake: () => {},
      onComplete: () => { advanceNextRef.current(true); },
    });

    return () => { writerRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, inputMode]);

  // Mode selection screen
  if (!inputMode) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => history.goBack()}><IonIcon icon={arrowBack} /></IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="mode-select-screen">
            <h2 className="mode-title">Elige el modo</h2>
            <p className="mode-sub">{characters.length} caracteres · HSK 1</p>
            <div className="mode-cards">
              <motion.button className="mode-card draw-card" whileTap={{ scale: 0.95 }}
                onClick={() => setInputMode('draw')}>
                <span className="mode-card-emoji">📝</span>
                <span className="mode-card-title">Dibujar</span>
                <span className="mode-card-desc">Escribe el carácter correctamente con tu dedo</span>
              </motion.button>
              <motion.button className="mode-card choice-card" whileTap={{ scale: 0.95 }}
                onClick={() => setInputMode('choice')}>
                <span className="mode-card-emoji">🧠</span>
                <span className="mode-card-title">Elegir</span>
                <span className="mode-card-desc">Selecciona el pinyin correcto entre 4 opciones</span>
              </motion.button>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const handleChoiceSelect = (chosen: string) => {
    if (choiceResult) return;
    const correct = chosen === currentCharacter.pinyin;
    setChoiceResult(correct ? 'correct' : 'wrong');
    advanceNext(correct);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setInputMode(null)}><IonIcon icon={arrowBack} /></IonButton>
          </IonButtons>
          <div className="quiz-progress-container">
            <div className="quiz-progress-track">
              <div className="quiz-progress-fill" style={{ width: `${((currentIndex) / characters.length) * 100}%` }} />
            </div>
            <span className="quiz-progress-label">{currentIndex + 1}/{characters.length}</span>
          </div>
          {inputMode === 'draw' && (
            <IonButtons slot="end">
              <IonButton onClick={() => setShowHint(true)} disabled={showHint} fill="clear">
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-blue)' }}>Pista</span>
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={inputMode !== 'draw'}>
        {inputMode === 'draw' ? (
          <div className="quiz-scene">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="quiz-definition">{currentCharacter.definition}</div>
              </motion.div>
            </AnimatePresence>
            <div className="quiz-writer-wrapper">
              <div
                ref={containerRef}
                className="quiz-writer"
                style={{ width: 260, height: 260, touchAction: 'none', pointerEvents: 'all', userSelect: 'none' }}
              />
              {showHint && (
                <motion.div className="quiz-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Pinyin: <strong style={{ color: 'var(--c-blue)' }}>{currentCharacter.pinyin}</strong>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="quiz-scene"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.22 }}
            >
              <div className="quiz-definition">{currentCharacter.definition}</div>
              <div className="quiz-choice-wrapper">
                <span className="quiz-choice-hanzi">{currentCharacter.character}</span>
                <div className="quiz-choices">
                  {choices.map((choice) => {
                    const isCorrect = choice === currentCharacter.pinyin;
                    return (
                      <motion.button
                        key={choice}
                        className={`quiz-choice-btn ${choiceResult && isCorrect ? 'correct' : ''}`}
                        style={{
                          background: choiceResult && isCorrect ? 'var(--c-green-bg)' : 'var(--c-surface)',
                          borderColor: choiceResult && isCorrect ? 'var(--c-green)' : 'var(--c-separator)',
                          color: choiceResult && isCorrect ? 'var(--c-green)' : 'var(--c-text)',
                        }}
                        onClick={() => handleChoiceSelect(choice)}
                        whileTap={{ scale: 0.96 }}
                      >
                        {choice}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PracticeQuizScreen;