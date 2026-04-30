import React, { useState, useCallback } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { arrowBack, checkmark, refresh } from 'ionicons/icons';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useIonRouter } from '@ionic/react';
import styles from './FlashcardScreen.module.css';
import '../styles/variables.css';
import { useUserStore } from '../stores/userStore';

const SAMPLE_CHARACTERS = [
  { id: '1', character: '爱', pinyin: 'ài', definition: 'amor, afecto, tener cariño', example: '我爱你 (wǒ ài nǐ) — Te amo' },
  { id: '2', character: '学', pinyin: 'xué', definition: 'estudiar, aprender, escuela', example: '学生 (xuéshēng) — estudiante' },
  { id: '3', character: '好', pinyin: 'hǎo', definition: 'bueno, bien, estar bien', example: '你好 (nǐ hǎo) — Hola' },
  { id: '4', character: '人', pinyin: 'rén', definition: 'persona, gente, ser humano', example: '中国人 (Zhōngguórén) — chino' },
  { id: '5', character: '大', pinyin: 'dà', definition: 'grande, mayor, adulto', example: '大家 (dàjiā) — todos' },
];

const TONE_MAP: Record<string, string> = {
  ā: 'var(--tone-1)', ē: 'var(--tone-1)', ī: 'var(--tone-1)', ō: 'var(--tone-1)', ū: 'var(--tone-1)',
  á: 'var(--tone-2)', é: 'var(--tone-2)', í: 'var(--tone-2)', ó: 'var(--tone-2)', ú: 'var(--tone-2)',
  ǎ: 'var(--tone-3)', ě: 'var(--tone-3)', ǐ: 'var(--tone-3)', ǒ: 'var(--tone-3)', ǔ: 'var(--tone-3)',
  à: 'var(--tone-4)', è: 'var(--tone-4)', ì: 'var(--tone-4)', ò: 'var(--tone-4)', ù: 'var(--tone-4)',
};

function getToneColor(pinyin: string): string {
  for (const ch of pinyin) if (TONE_MAP[ch]) return TONE_MAP[ch];
  return 'var(--tone-5)';
}

interface XPToast { id: number; amount: number }

const FlashcardScreen: React.FC = () => {
  const router = useIonRouter();
  const addXP = useUserStore((s) => s.addXP);
  const recordActivity = useUserStore((s) => s.recordActivity);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [xpToasts, setXpToasts] = useState<XPToast[]>([]);
  const [toastCounter, setToastCounter] = useState(0);
  const [exitDir, setExitDir] = useState<'right' | 'left' | null>(null);

  const currentCharacter = SAMPLE_CHARACTERS[currentIndex];
  const progress = currentIndex / SAMPLE_CHARACTERS.length;
  const toneColor = getToneColor(currentCharacter.pinyin);

  const dragX = useMotionValue(0);
  const cardOpacity = useTransform(dragX, [-180, 0, 180], [0.3, 1, 0.3]);
  const cardRotate = useTransform(dragX, [-180, 0, 180], [-15, 0, 15]);
  const correctOpacity = useTransform(dragX, [20, 90], [0, 1]);
  const repeatOpacity = useTransform(dragX, [-90, -20], [1, 0]);

  const fireXPToast = useCallback((amount: number) => {
    const id = toastCounter;
    setToastCounter((c) => c + 1);
    setXpToasts((prev) => [...prev, { id, amount }]);
    setTimeout(() => setXpToasts((prev) => prev.filter((t) => t.id !== id)), 1100);
  }, [toastCounter]);

  const advance = useCallback((correct: boolean) => {
    setExitDir(correct ? 'right' : 'left');
    if (correct) {
      addXP(10);
      recordActivity();
      fireXPToast(10);
    }
    setTimeout(() => {
      dragX.set(0);
      setExitDir(null);
      setIsFlipped(false);
      if (correct) {
        if (currentIndex < SAMPLE_CHARACTERS.length - 1) setCurrentIndex((i) => i + 1);
        else router.push('/congratulations');
      } else {
        setIsFlipped(true);
      }
    }, 280);
  }, [currentIndex, addXP, recordActivity, fireXPToast, router, dragX]);

  const handleDragEnd = useCallback(
    (_e: unknown, info: { offset: { x: number } }) => {
      if (info.offset.x > 90) advance(true);
      else if (info.offset.x < -90) advance(false);
      else dragX.set(0);
    },
    [advance, dragX],
  );

  return (
    <IonPage className={styles.page}>
      <IonHeader className={styles.header}>
        <IonToolbar className={styles.toolbar}>
          <IonButtons slot="start">
            <IonButton onClick={() => router.push('/tabs/practice')} fill="clear">
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <div className={styles.progressContainer}>
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className={styles.progressLabel}>{currentIndex + 1}/{SAMPLE_CHARACTERS.length}</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className={styles.content} scrollY={false}>
        <div className={styles.scene}>
          {/* Swipe hint badges */}
          <motion.div className={`${styles.hintBadge} ${styles.hintLeft}`} style={{ opacity: repeatOpacity }}>
            🔁 Repetir
          </motion.div>
          <motion.div className={`${styles.hintBadge} ${styles.hintRight}`} style={{ opacity: correctOpacity }}>
            ✓ Correcto
          </motion.div>

          {/* XP toasts */}
          <AnimatePresence>
            {xpToasts.map((t) => (
              <motion.div key={t.id} className={styles.xpToast}
                initial={{ opacity: 0, y: 10, scale: 0.7 }}
                animate={{ opacity: 1, y: -50, scale: 1 }}
                exit={{ opacity: 0, y: -80, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                +{t.amount} XP ⚡
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Flashcard */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className={styles.cardWrapper}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              style={{ x: dragX, opacity: cardOpacity, rotate: cardRotate }}
              onDragEnd={handleDragEnd}
              animate={
                exitDir === 'right'
                  ? { x: 380, opacity: 0, rotate: 18 }
                  : exitDir === 'left'
                  ? { x: -380, opacity: 0, rotate: -18 }
                  : { x: 0, opacity: 1, rotate: 0 }
              }
              initial={{ scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              <motion.div
                className={styles.cardInner}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' as const }}
              >
                {/* — Front — */}
                <div className={`${styles.cardFace} ${styles.cardFront}`}>
                  <span className={styles.hanzi}>{currentCharacter.character}</span>
                  <button className={styles.flipBtn} onClick={() => setIsFlipped(true)}>
                    Ver definición
                  </button>
                </div>

                {/* — Back — */}
                <div className={`${styles.cardFace} ${styles.cardBack}`}>
                  <span className={styles.hanziSm}>{currentCharacter.character}</span>
                  <span className={styles.pinyin} style={{ color: toneColor }}>{currentCharacter.pinyin}</span>
                  <p className={styles.definition}>{currentCharacter.definition}</p>
                  {currentCharacter.example && (
                    <span className={styles.example}>{currentCharacter.example}</span>
                  )}
                  <button className={styles.flipBtn} onClick={() => setIsFlipped(false)}>
                    ← Ver carácter
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div className={styles.actions}>
            <motion.button className={`${styles.actionBtn} ${styles.repeatBtn}`}
              onClick={() => advance(false)} whileTap={{ scale: 0.9 }}>
              <IonIcon icon={refresh} />
              <span>Repetir</span>
            </motion.button>
            <motion.button className={`${styles.actionBtn} ${styles.correctBtn}`}
              onClick={() => advance(true)} whileTap={{ scale: 0.9 }}>
              <IonIcon icon={checkmark} />
              <span>Correcto</span>
            </motion.button>
          </div>

          <p className={styles.swipeHint}>Desliza → correcto · ← repetir</p>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default FlashcardScreen;

// Datos de ejemplo (en producción vendrían de una API/store)
const SAMPLE_CHARACTERS = [
  {
    id: '1',
    character: '爱',
    pinyin: 'ài',
    definition: 'amor, afecto, tener cariño, gustar',
    example: '我爱你 (wǒ ài nǐ) - Te amo',
    difficulty: 'medium' as const,
    correctCount: 5
  },
  {
    id: '2',
    character: '学',
    pinyin: 'xué',
    definition: 'estudiar, aprender, escuela',
    example: '学生 (xuéshēng) - estudiante',
    difficulty: 'easy' as const,
    correctCount: 8
  }
];


const FlashcardScreen: React.FC = () => {
  const router = useIonRouter();
  const [, dispatch] = useReducer(flashcardReducer, initialState);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPinyin, setShowPinyin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDefinitionExpanded, setIsDefinitionExpanded] = useState(false); // NUEVO


  const currentCharacter = SAMPLE_CHARACTERS[currentIndex];

  useEffect(() => {
    // Calcular progreso
    const newProgress = ((currentIndex + 1) / SAMPLE_CHARACTERS.length) * 100;
    setProgress(newProgress);
  }, [currentIndex]);

  const handleBack = () => {
    router.push('/tabs/practice');

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

const toggleDefinition = () => {
    setIsDefinitionExpanded(!isDefinitionExpanded);
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
        scrollY={true} // Sin scroll en vista principal
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

          {/* Footer con definición - VISTA COMPACTA */}
          <div className={styles.footerSection}>
            <div 
              className={styles.definitionCardCompact}
              onClick={toggleDefinition}
              role="button"
              aria-label="Expand definition"
            >
              <div className={styles.definitionHeaderCompact}>
                <span className={styles.definitionCharacterCompact}>
                  {currentCharacter.character}
                </span>
                <span className={styles.definitionPinyinCompact}>
                  {currentCharacter.pinyin}
                </span>
              </div>
              <div className={styles.definitionTextCompact}>
                {currentCharacter.definition.length > 60 
                  ? `${currentCharacter.definition.substring(0, 60)}…`
                  : currentCharacter.definition}
              </div>
              {currentCharacter.example && (
                <div className={styles.definitionExampleCompact}>
                  {currentCharacter.example.length > 50
                    ? `${currentCharacter.example.substring(0, 50)}…`
                    : currentCharacter.example}
                </div>
              )}
              <div className={styles.definitionHintCompact}>
                Toca para expandir
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      {/* Modal para diccionario expandido */}
      <IonModal
        isOpen={isDefinitionExpanded}
        onDidDismiss={() => setIsDefinitionExpanded(false)}
        className={styles.definitionModal}
        initialBreakpoint={0.75}
        breakpoints={[0.5, 0.75, 1]}
        handleBehavior="cycle"
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Definición</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsDefinitionExpanded(false)}>
                <IonIcon icon={close} slot="icon-only" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className={styles.modalContent}>
          <div className={styles.definitionCardExpanded}>
            <div className={styles.definitionHeaderExpanded}>
              <div className={styles.definitionCharacterExpanded}>
                {currentCharacter.character}
              </div>
              <div className={styles.definitionPinyinExpanded}>
                {currentCharacter.pinyin}
              </div>
            </div>
            
            <div className={styles.definitionTextExpanded}>
              <div className={styles.definitionLabel}>Meaning</div>
              <div className={styles.definitionContent}>
                {currentCharacter.definition}
              </div>
            </div>
            
            {currentCharacter.example && (
              <div className={styles.definitionExampleExpanded}>
                <div className={styles.definitionLabel}>Example</div>
                <div className={styles.definitionContent}>
                  {currentCharacter.example}
                </div>
              </div>
            )}
            
          </div>
        </IonContent>
      </IonModal>

      <IonLoading
        isOpen={isLoading}
        message="Processing..."
        spinner="crescent"
      />
    </IonPage>
  );
};
export default FlashcardScreen;