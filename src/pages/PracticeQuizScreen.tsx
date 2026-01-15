// src/pages/PracticeQuizScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonLoading
} from '@ionic/react';
import { arrowBack, helpCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import HanziWriter from 'hanzi-writer';
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

const PracticeQuizScreen: React.FC = () => {
  const history = useHistory();
  const writerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<boolean[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const characters: Character[] = charactersData;
  const currentCharacter = characters[currentIndex];

  useEffect(() => {
    if (!containerRef.current || !currentCharacter) return;

    const initWriter = () => {
      // Limpiar contenedor
      const container = containerRef.current;
      if (!container) return;

      while (container.firstChild) {
        container.removeChild(container.firstChild);
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
        onMistake: (strokeData: any) => {
          setIsDrawing(true);
        },
        onComplete: (summary: any) => {
          setIsDrawing(false);
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