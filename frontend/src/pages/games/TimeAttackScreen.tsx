// src/pages/games/TimeAttackScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistory, useLocation } from 'react-router-dom';
import HanziWriter, { HanziWriterInstance } from 'hanzi-writer';
import { useSessionStore } from '../../stores/sessionStore';
import { useUserStore } from '../../stores/userStore';
import charactersData from '../../data/characters.json';

const GAME_DURATION_MS = 60_000;

interface LocationState { inputMode?: 'draw' | 'choice' }

interface Char {
  id: string;
  character: string;
  pinyin: string;
  definition: string;
}

function buildChoices(chars: Char[], correctIdx: number): string[] {
  const correct = chars[correctIdx].pinyin;
  const pool = chars.filter((_, i) => i !== correctIdx).map((c) => c.pinyin);
  const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  return [...distractors, correct].sort(() => Math.random() - 0.5);
}

const TimeAttackScreen: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const inputMode = location.state?.inputMode ?? 'choice';

  const {
    score, combo, correct, incorrect,
    currentIndex, queue,
    startSession, recordCorrect, recordIncorrect, nextCharacter,
    endSession, tickTimer, elapsedMs, updatePersonalBest,
  } = useSessionStore();
  const { addXP, recordActivity } = useUserStore();

  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [choices, setChoices] = useState<string[]>([]);
  const [choiceResult, setChoiceResult] = useState<'correct' | 'wrong' | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const writerRef = useRef<HanziWriterInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const remaining = Math.max(0, GAME_DURATION_MS - elapsedMs);

  // Build queue from characters data cast
  const chars = (charactersData as Char[]);

  const startGame = useCallback(() => {
    const shuffled = [...chars].sort(() => Math.random() - 0.5).slice(0, 40);
    startSession('time-attack', inputMode, shuffled, GAME_DURATION_MS);
    setPhase('playing');
  }, [chars, inputMode, startSession]);

  // Timer loop
  useEffect(() => {
    if (phase !== 'playing') return;
    const tick = (ts: number) => {
      if (lastTsRef.current) {
        const delta = ts - lastTsRef.current;
        tickTimer(delta);
      }
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase, tickTimer]);

  // Check time up
  useEffect(() => {
    if (phase === 'playing' && remaining <= 0) {
      endSession();
      updatePersonalBest('time-attack', score);
      addXP(score);
      recordActivity();
      setPhase('done');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase]);

  // Build choices when currentIndex changes (choice mode)
  useEffect(() => {
    if (phase !== 'playing' || inputMode !== 'choice' || queue.length === 0) return;
    setChoices(buildChoices(queue as Char[], currentIndex));
    setChoiceResult(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, phase]);

  // HanziWriter (draw mode)
  useEffect(() => {
    if (phase !== 'playing' || inputMode !== 'draw' || !containerRef.current || queue.length === 0) return;
    const el = containerRef.current;
    while (el.firstChild) el.removeChild(el.firstChild);
    const cs = getComputedStyle(document.documentElement);
    writerRef.current = HanziWriter.create(el, queue[currentIndex]?.character ?? '一', {
      width: 180,
      height: 180,
      padding: 10,
      showOutline: true,
      strokeColor: cs.getPropertyValue('--c-blue').trim(),
      outlineColor: cs.getPropertyValue('--c-bg-tertiary').trim(),
      drawingColor: cs.getPropertyValue('--c-blue').trim(),
      highlightOnComplete: true,
      onLoadCharDataError: (reason) => console.error('HanziWriter data load error:', reason),
    });
    writerRef.current.quiz({
      onMistake: () => recordIncorrect(),
      onComplete: () => {
        recordCorrect();
        setTimeout(() => nextCharacter(), 600);
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, phase, inputMode]);

  const handleChoice = (pinyin: string) => {
    if (choiceResult) return;
    const correct_pinyin = queue[currentIndex]?.pinyin;
    if (pinyin === correct_pinyin) {
      recordCorrect();
      setChoiceResult('correct');
      setTimeout(() => { nextCharacter(); setChoiceResult(null); }, 400);
    } else {
      recordIncorrect();
      setChoiceResult('wrong');
      setTimeout(() => { nextCharacter(); setChoiceResult(null); }, 600);
    }
  };

  const timerPct = remaining / GAME_DURATION_MS;
  const isUrgent = remaining < 10_000;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const comboMultiplier = combo >= 5 ? 3 : combo >= 3 ? 2 : 1;
  const currentChar = queue[currentIndex];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <AnimatePresence mode="wait">

          {phase === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                minHeight: 'calc(100vh - 56px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                gap: 24,
              }}
            >
              <div style={{ fontSize: 72 }}>⏱️</div>
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 28, fontWeight: 800, color: 'var(--c-text)', textAlign: 'center' }}>
                Contrarreloj
              </div>
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 15, color: 'var(--c-text-secondary)', textAlign: 'center', maxWidth: 280 }}>
                60 segundos. Consigue el mayor número de aciertos posible.
                El combo multiplicador aumenta la puntuación (×2 en 3 seguidos, ×3 en 5+).
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={startGame}
                style={{
                  padding: '18px 48px',
                  background: 'var(--c-blue)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 16,
                  fontFamily: 'var(--font-family)',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,113,227,0.4)',
                }}
              >
                ¡Empezar!
              </motion.button>
            </motion.div>
          )}

          {phase === 'playing' && currentChar && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 24px 32px',
                gap: 16,
              }}
            >
              {/* Timer */}
              <div style={{ width: '100%', position: 'relative' }}>
                <div style={{
                  width: '100%',
                  height: 8,
                  background: 'var(--c-bg-tertiary)',
                  borderRadius: 99,
                  overflow: 'hidden',
                }}>
                  <motion.div
                    animate={{ width: `${timerPct * 100}%` }}
                    transition={{ duration: 0.1 }}
                    style={{
                      height: '100%',
                      background: isUrgent ? 'var(--c-red)' : 'var(--c-blue)',
                      borderRadius: 99,
                    }}
                  />
                </div>
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 12,
                  fontFamily: 'var(--font-family)',
                  fontSize: 20,
                  fontWeight: 800,
                  color: isUrgent ? 'var(--c-red)' : 'var(--c-text)',
                }}>
                  <motion.span
                    animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  >
                    {timeStr}
                  </motion.span>
                </div>
              </div>

              {/* Score + combo */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8 }}>
                <div style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'var(--c-text)',
                }}>{score} pts</div>
                {combo >= 3 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      background: combo >= 5 ? 'var(--c-red)' : 'var(--c-amber)',
                      color: '#fff',
                      borderRadius: 99,
                      padding: '4px 12px',
                      fontFamily: 'var(--font-family)',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    🔥 ×{comboMultiplier}
                  </motion.div>
                )}
              </div>

              {/* Score tally */}
              <div style={{
                display: 'flex',
                gap: 16,
                fontFamily: 'var(--font-family)',
                fontSize: 13,
                color: 'var(--c-text-secondary)',
              }}>
                <span>✅ {correct}</span>
                <span>❌ {incorrect}</span>
              </div>

              {inputMode === 'choice' && (
                <>
                  <div style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 15,
                    color: 'var(--c-text-secondary)',
                    textAlign: 'center',
                  }}>{currentChar.definition}</div>
                  <div style={{
                    fontSize: 80,
                    fontWeight: 900,
                    color: 'var(--c-text)',
                    lineHeight: 1,
                  }}>{currentChar.character}</div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                    width: '100%',
                    maxWidth: 320,
                  }}>
                    {choices.map((ch) => (
                      <motion.button
                        key={ch}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChoice(ch)}
                        animate={
                          choiceResult && ch === currentChar.pinyin
                            ? { backgroundColor: 'var(--c-green-bg)', borderColor: 'var(--c-green)' }
                            : {}
                        }
                        style={{
                          padding: '16px 8px',
                          border: '2px solid var(--c-separator)',
                          borderRadius: 14,
                          fontFamily: 'var(--font-family)',
                          fontSize: 16,
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: 'var(--c-surface)',
                          color: 'var(--c-text)',
                        }}
                      >
                        {ch}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}

              {inputMode === 'draw' && (
                <>
                  <div style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 15,
                    color: 'var(--c-text-secondary)',
                    textAlign: 'center',
                  }}>{currentChar.definition} — {currentChar.pinyin}</div>
                  <div
                    ref={containerRef}
                    style={{
                      width: 180,
                      height: 180,
                      touchAction: 'none',
                      background: 'var(--c-surface)',
                      borderRadius: 20,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                      overflow: 'hidden',
                    }}
                  />
                </>
              )}
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                minHeight: 'calc(100vh - 56px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                gap: 20,
              }}
            >
              <div style={{ fontSize: 72 }}>🏁</div>
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 28, fontWeight: 800, color: 'var(--c-text)' }}>
                ¡Tiempo!
              </div>
              <div style={{
                background: 'var(--c-surface)',
                borderRadius: 20,
                padding: '28px 32px',
                width: '100%',
                maxWidth: 320,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              }}>
                {[
                  { label: 'Puntos', value: `${score}`, emoji: '⭐' },
                  { label: 'Correctos', value: `${correct}`, emoji: '✅' },
                  { label: 'Errores', value: `${incorrect}`, emoji: '❌' },
                  { label: 'Mejor combo', value: `×${useSessionStore.getState().maxCombo}`, emoji: '🔥' },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 15, color: 'var(--c-text-secondary)' }}>
                      {row.emoji} {row.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 18, fontWeight: 700, color: 'var(--c-text)' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 14, color: 'var(--c-green)', fontWeight: 600 }}>
                +{score} XP ganados
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={startGame}
                  style={{
                    padding: '14px 28px',
                    background: 'var(--c-blue)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    fontFamily: 'var(--font-family)',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Jugar de nuevo
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => history.goBack()}
                  style={{
                    padding: '14px 28px',
                    background: 'var(--c-bg-secondary)',
                    color: 'var(--c-text)',
                    border: 'none',
                    borderRadius: 14,
                    fontFamily: 'var(--font-family)',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Salir
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default TimeAttackScreen;
