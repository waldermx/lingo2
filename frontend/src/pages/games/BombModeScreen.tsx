// src/pages/games/BombModeScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistory, useLocation } from 'react-router-dom';
import HanziWriter, { HanziWriterInstance } from 'hanzi-writer';
import { useSessionStore } from '../../stores/sessionStore';
import { useUserStore } from '../../stores/userStore';
import charactersData from '../../data/characters.json';

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

// SVG Bomb component
const Bomb: React.FC<{ fusePercent: number; exploded: boolean }> = ({ fusePercent, exploded }) => {
  const fuseHeight = 40;
  const usedH = fuseHeight * (1 - fusePercent);

  if (exploded) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [1, 1.4, 0.8, 1.2, 1], opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: 100, lineHeight: 1, textAlign: 'center' }}
      >
        💥
      </motion.div>
    );
  }

  return (
    <svg width="120" height="160" viewBox="0 0 120 160">
      {/* Fuse */}
      <line x1="60" y1="40" x2="60" y2="0" stroke="#888" strokeWidth="4" strokeLinecap="round" />
      {/* Spark on fuse */}
      {fusePercent > 0 && (
        <circle cx="60" cy={usedH} r="4" fill="#FF9F0A">
          <animate attributeName="opacity" values="1;0.4;1" dur="0.3s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Bomb body */}
      <circle
        cx="60"
        cy="100"
        r="50"
        fill={fusePercent < 0.3 ? '#FF375F' : fusePercent < 0.6 ? '#FF9F0A' : '#333'}
      />
      {/* Shine */}
      <ellipse cx="44" cy="82" rx="10" ry="6" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
};

const BombModeScreen: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const inputMode = location.state?.inputMode ?? 'choice';

  const {
    score, combo, correct, hasExploded,
    currentIndex, queue, bombFuseMs,
    startSession, recordCorrect, recordIncorrect, nextCharacter,
    endSession, tickTimer, explodeBomb, updatePersonalBest,
  } = useSessionStore();
  const { addXP, recordActivity } = useUserStore();

  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [choices, setChoices] = useState<string[]>([]);
  const [choiceResult, setChoiceResult] = useState<'correct' | 'wrong' | null>(null);
  const [shaking, setShaking] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const writerRef = useRef<HanziWriterInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const chars = (charactersData as Char[]);
  const INITIAL_FUSE = 30_000;
  const fusePercent = Math.max(0, bombFuseMs / (INITIAL_FUSE + correct * 5000));

  const startGame = useCallback(() => {
    const shuffled = [...chars].sort(() => Math.random() - 0.5);
    startSession('bomb-mode', inputMode, shuffled, undefined);
    setPhase('playing');
  }, [chars, inputMode, startSession]);

  // Timer tick
  useEffect(() => {
    if (phase !== 'playing') return;
    const tick = (ts: number) => {
      if (lastTsRef.current) tickTimer(ts - lastTsRef.current);
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase, tickTimer]);

  // Check explosion
  useEffect(() => {
    if (phase === 'playing' && bombFuseMs <= 0 && !hasExploded) {
      explodeBomb();
    }
    if (phase === 'playing' && hasExploded) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      endSession();
      updatePersonalBest('bomb-mode', score);
      addXP(score);
      recordActivity();
      setPhase('done');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bombFuseMs, hasExploded, phase]);

  // Build choices
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
      strokeColor: cs.getPropertyValue('--c-red').trim(),
      outlineColor: cs.getPropertyValue('--c-bg-tertiary').trim(),
      drawingColor: cs.getPropertyValue('--c-red').trim(),
      highlightOnComplete: true,
      onLoadCharDataError: (reason) => console.error('HanziWriter data load error:', reason),
    });
    writerRef.current.quiz({
      onMistake: () => {
        recordIncorrect();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        explodeBomb();
      },
      onComplete: () => {
        recordCorrect();
        setTimeout(() => nextCharacter(), 400);
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
      setTimeout(() => { nextCharacter(); setChoiceResult(null); }, 350);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      recordIncorrect();
      explodeBomb();
    }
  };

  const isUrgent = bombFuseMs < 8_000;
  const msStr = Math.max(0, Math.ceil(bombFuseMs / 1000));
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
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 32, gap: 24,
              }}
            >
              <div style={{ fontSize: 80 }}>💣</div>
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 28, fontWeight: 800, color: 'var(--c-text)', textAlign: 'center' }}>
                Modo Bomba
              </div>
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 15, color: 'var(--c-text-secondary)', textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
                Empieza con 30 segundos en la mecha. Cada acierto añade +5 segundos.
                Un solo error y… ¡BOOM! ¿Hasta qué carácter llegas?
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={startGame}
                style={{
                  padding: '18px 48px',
                  background: 'linear-gradient(135deg, #FF375F, #FF9F0A)',
                  color: '#fff', border: 'none', borderRadius: 16,
                  fontFamily: 'var(--font-family)', fontSize: 18, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(255,55,95,0.4)',
                }}
              >
                ¡Empezar!
              </motion.button>
            </motion.div>
          )}

          {phase === 'playing' && currentChar && (
            <motion.div
              key="playing"
              animate={shaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 24px 32px',
                gap: 16,
                background: isUrgent ? 'rgba(255,55,95,0.06)' : undefined,
                minHeight: 'calc(100vh - 56px)',
              }}
            >
              {/* Fuse timer bar */}
              <div style={{ width: '100%' }}>
                <div style={{
                  width: '100%', height: 8,
                  background: 'var(--c-bg-tertiary)',
                  borderRadius: 99, overflow: 'hidden',
                }}>
                  <motion.div
                    animate={{ width: `${fusePercent * 100}%` }}
                    transition={{ duration: 0.1 }}
                    style={{
                      height: '100%',
                      background: isUrgent
                        ? 'var(--c-red)'
                        : bombFuseMs < 15000
                        ? 'var(--c-amber)'
                        : 'var(--c-green)',
                      borderRadius: 99,
                    }}
                  />
                </div>
                <div style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-family)',
                  fontSize: 18,
                  fontWeight: 800,
                  color: isUrgent ? 'var(--c-red)' : 'var(--c-text)',
                  marginTop: 4,
                }}>
                  <motion.span animate={isUrgent ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }}>
                    {msStr}s
                  </motion.span>
                </div>
              </div>

              {/* Bomb visual */}
              <Bomb fusePercent={fusePercent} exploded={false} />

              {/* Score */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 24, fontWeight: 800, color: 'var(--c-text)' }}>
                  {score} pts
                </span>
                {combo >= 3 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      background: 'var(--c-amber)', color: '#fff',
                      borderRadius: 99, padding: '3px 10px',
                      fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 700,
                    }}
                  >
                    🔥 ×{combo >= 5 ? 3 : 2}
                  </motion.span>
                )}
              </div>

              {inputMode === 'choice' && (
                <>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 15, color: 'var(--c-text-secondary)', textAlign: 'center' }}>
                    {currentChar.definition}
                  </div>
                  <div style={{ fontSize: 80, fontWeight: 900, color: 'var(--c-text)', lineHeight: 1 }}>
                    {currentChar.character}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 320 }}>
                    {choices.map((ch) => (
                      <motion.button
                        key={ch}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChoice(ch)}
                        animate={
                          choiceResult === 'correct' && ch === currentChar.pinyin
                            ? { backgroundColor: 'var(--c-green-bg)', borderColor: 'var(--c-green)' }
                            : {}
                        }
                        style={{
                          padding: '16px 8px',
                          border: '2px solid var(--c-separator)',
                          borderRadius: 14,
                          fontFamily: 'var(--font-family)',
                          fontSize: 16, fontWeight: 600,
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
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 15, color: 'var(--c-text-secondary)', textAlign: 'center' }}>
                    {currentChar.definition} — {currentChar.pinyin}
                  </div>
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
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 32, gap: 20,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 0.9, 1.1, 1] }}
                transition={{ duration: 0.6 }}
                style={{ fontSize: 96 }}
              >
                💥
              </motion.div>
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 28, fontWeight: 800, color: 'var(--c-text)' }}>
                ¡BOOM!
              </div>
              <div style={{
                background: 'var(--c-surface)', borderRadius: 20,
                padding: '28px 32px', width: '100%', maxWidth: 300,
                display: 'flex', flexDirection: 'column', gap: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              }}>
                {[
                  { label: 'Puntos conseguidos', value: `${score}`, emoji: '⭐' },
                  { label: 'Caracteres correctos', value: `${correct}`, emoji: '✅' },
                  { label: 'Mejor racha', value: `${useSessionStore.getState().maxCombo}`, emoji: '🔥' },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 14, color: 'var(--c-text-secondary)' }}>
                      {row.emoji} {row.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-family)', fontSize: 17, fontWeight: 700, color: 'var(--c-text)' }}>
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
                    background: 'linear-gradient(135deg, #FF375F, #FF9F0A)',
                    color: '#fff', border: 'none', borderRadius: 14,
                    fontFamily: 'var(--font-family)', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Intentar de nuevo
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => history.goBack()}
                  style={{
                    padding: '14px 28px',
                    background: 'var(--c-bg-secondary)',
                    color: 'var(--c-text)', border: 'none', borderRadius: 14,
                    fontFamily: 'var(--font-family)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
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

export default BombModeScreen;
