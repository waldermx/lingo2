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
  const [results, setResults] = useState<boolean[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [choiceResult, setChoiceResult] = useState<'correct' | 'wrong' | null>(null);

  const characters: Character[] = charactersData;
  const currentCharacter = characters[currentIndex];

  const advanceNext = useCallback((correct: boolean) => {
    const newResults = [...results, correct];
    setResults(newResults);
    setTimeout(() => {
      if (currentIndex < characters.length - 1) {
        setCurrentIndex((i) => i + 1);
        setShowHint(false);
        setChoiceResult(null);
        setChoices(inputMode === 'choice' ? buildChoices(characters, currentIndex + 1) : []);
      } else {
        history.push('/practice-results', { results: newResults });
      }
    }, 700);
  }, [results, currentIndex, characters, history, inputMode]);

  // Init choices when mode=choice
  useEffect(() => {
    if (inputMode === 'choice') setChoices(buildChoices(characters, currentIndex));
  }, [inputMode, currentIndex, characters]);

  // Init HanziWriter in draw mode
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
      drawingWidth: 40,
      strokeWidth: 5,
      showHintAfterMisses: 2,
      highlightOnComplete: true,
      highlightColor: 'var(--c-green)',
      strokeAnimationSpeed: 1.5,
      delayBetweenStrokes: 400,
    });

    writerRef.current.quiz({
      onMistake: () => {},
      onComplete: () => { advanceNext(true); },
    });

    return () => { writerRef.current = null; };
  }, [currentIndex, currentCharacter, inputMode, advanceNext]);

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
      }

      // Crear instancia de Hanzi Writer en modo quiz
      writerRef.current = HanziWriter.create(container, currentCharacter.character, {
        width: 300,
        height: 300,
        padding: 5,
        showOutline: false,
        showCharacter: false,
        outlineColor: '#666',
        strokeColor: '#000',
        drawingColor: '#2E7D32',
        drawingWidth: 40, // Grosor del trazo del usuario
        strokeWidth: 5, // Grosor del contorno guía
        showHintAfterMisses: 2,
        highlightOnComplete: true,
        highlightColor: '#4CAF50',
        highlightCompleteColor: '#4CAF50',
        strokeAnimationSpeed: 1.5,
        delayBetweenStrokes: 400,
      });

      writerRef.current.quiz({
        onMistake: () => {},
        onComplete: () => {
          // Marcar como correcto
          const newResults = [...results, true];
          setResults(newResults);
          
          // Avanzar al siguiente carácter después de un breve delay
          setTimeout(() => {
            if (currentIndex < characters.length - 1) {
              setCurrentIndex(prev => prev + 1);
              setShowHint(false);
            } else {
              // Terminó la práctica, ir a resultados
              history.push('/practice-results', { results: newResults });
            }
          }, 800);
        }
      });

      setIsLoading(false);
    };

    initWriter();

    return () => {
      if (writerRef.current) {
        writerRef.current = null;
      }
    };
  }, [currentIndex, currentCharacter, history, characters.length, results]);

  const handleBack = () => {
    history.goBack();
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBack}>
              <IonIcon icon={arrowBack} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Práctica</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleShowHint} disabled={showHint}>
              <IonIcon icon={helpCircle} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="quiz-container">
          {/* Significado del carácter */}
          <div className="character-meaning">
            <p>{currentCharacter.definition}</p>
          </div>

          {/* Área de escritura */}
          <div className="writing-area">
            <div 
              ref={containerRef}
              className="hanzi-writer-container"
              style={{ width: '300px', height: '300px', margin: '0 auto' }}
            />
          </div>

          {/* Pista (pinyin) */}
          {showHint && (
            <div className="hint-section">
              <div className="hint-text">
                Pinyin: <strong>{currentCharacter.pinyin}</strong>
              </div>
            </div>
          )}

          {/* Progreso */}
          <div className="progress-indicator">
            Carácter {currentIndex + 1} de {characters.length}
          </div>
        </div>
      </IonContent>

      <IonLoading isOpen={isLoading} message="Cargando..." />
    </IonPage>
  );
};

export default PracticeQuizScreen;