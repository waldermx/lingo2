import React, { useReducer, useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonLoading,
  useIonRouter
} from '@ionic/react';
import { flashcardReducer, initialState } from '../reducers/flashcardReducer';
import FlashcardHeader from '../components/FlashcardHeader/FlashcardHeader';
import CharacterDisplay from '../components/CharacterDisplay/CharacterDisplay';
import PracticeCard from '../components/PracticeCard/PracticeCard';
import ActionButtons from '../components/ActionButtons/ActionButtons';
import DefinitionFooter from '../components/DefinitionFooter/DefinitionFooter';
import styles from './FlashcardScreen.module.css';
import '../styles/variables.css';

// Datos de ejemplo (en producción vendrían de una API/store)
const SAMPLE_CHARACTERS = [
  {
    id: '1',
    character: '爱',
    pinyin: 'ài',
    definition: 'love, affection, to be fond of, to like',
    example: '我爱你 (wǒ ài nǐ) - I love you',
    difficulty: 'medium' as const,
    correctCount: 5
  },
  {
    id: '2',
    character: '学',
    pinyin: 'xué',
    definition: 'to study, to learn, school',
    example: '学生 (xuéshēng) - student',
    difficulty: 'easy' as const,
    correctCount: 8
  }
];

const FlashcardScreen: React.FC = () => {
  const router = useIonRouter();
  const [state, dispatch] = useReducer(flashcardReducer, initialState);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPinyin, setShowPinyin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentCharacter = SAMPLE_CHARACTERS[currentIndex];

  useEffect(() => {
    // Calcular progreso
    const newProgress = ((currentIndex + 1) / SAMPLE_CHARACTERS.length) * 100;
    setProgress(newProgress);
  }, [currentIndex]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.goBack();
    }
  };

  const handleCorrect = () => {
    setIsLoading(true);
    
    // Simular procesamiento
    setTimeout(() => {
      dispatch({ type: 'MARK_CORRECT' });
      
      // Avanzar al siguiente carácter
      if (currentIndex < SAMPLE_CHARACTERS.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowPinyin(false);
      } else {
        // Fin del módulo
        router.push('/congratulations');
      }
      
      setIsLoading(false);
    }, 300);
  };

  const handleRepeat = () => {
    setIsLoading(true);
    
    // Simular procesamiento
    setTimeout(() => {
      dispatch({ type: 'MARK_REPEAT' });
      setShowPinyin(true);
      setIsLoading(false);
    }, 300);
  };

  const togglePinyin = () => {
    setShowPinyin(!showPinyin);
  };

  return (
    <IonPage className={styles.page}>
      <FlashcardHeader 
        moduleName="Memozi - HSK 1"
        onBack={handleBack}
        progress={progress}
      />

      <IonContent 
        className={`ion-padding ${styles.content}`}
        scrollY={false}
        forceOverscroll={false}
      >
        <div className={styles.mainContainer}>
          {/* Display del carácter */}
          <div 
            className={styles.characterSection}
            onClick={togglePinyin}
            role="button"
            aria-label="Toggle pronunciation display"
          >
            <CharacterDisplay 
              character={currentCharacter.character}
              pinyin={currentCharacter.pinyin}
              showPinyin={showPinyin}
            />
          </div>

          {/* Tarjeta de práctica */}
          <div className={styles.practiceSection}>
            <PracticeCard 
              watermarkCharacter={currentCharacter.character}
              onDrawStart={() => console.log('Drawing started')}
              onDrawEnd={() => console.log('Drawing ended')}
            />
          </div>

          {/* Botones de acción */}
          <div className={styles.actionsSection}>
            <ActionButtons 
              onCorrect={handleCorrect}
              onRepeat={handleRepeat}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Footer con definición */}
        <div className={styles.footerSection}>
          <DefinitionFooter 
            character={currentCharacter.character}
            pinyin={currentCharacter.pinyin}
            definition={currentCharacter.definition}
            example={currentCharacter.example}
          />
        </div>
      </IonContent>

      <IonLoading
        isOpen={isLoading}
        message="Processing..."
        spinner="crescent"
      />
    </IonPage>
  );
};

export default FlashcardScreen;