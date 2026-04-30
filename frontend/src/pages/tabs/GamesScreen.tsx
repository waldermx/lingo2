// src/pages/tabs/GamesScreen.tsx
import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSessionStore } from '../../stores/sessionStore';
import './GamesScreen.module.css';

const GamesScreen: React.FC = () => {
  const history = useHistory();
  const { personalBests } = useSessionStore();
  const [inputMode, setInputMode] = useState<'draw' | 'choice'>('choice');

  const handlePlay = (mode: 'time-attack' | 'bomb-mode') => {
    history.push(`/games/${mode}`, { inputMode });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Juegos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Input mode toggle */}
          <div>
            <p style={{
              fontFamily: 'var(--font-family)',
              fontSize: 13,
              color: 'var(--c-text-secondary)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 10px',
            }}>Modo de entrada</p>
            <div style={{
              display: 'flex',
              background: 'var(--c-bg-secondary)',
              borderRadius: 10,
              padding: 4,
              gap: 4,
            }}>
              {(['choice', 'draw'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setInputMode(m)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    border: 'none',
                    borderRadius: 8,
                    fontFamily: 'var(--font-family)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: inputMode === m ? 'var(--c-surface)' : 'transparent',
                    color: inputMode === m ? 'var(--c-text)' : 'var(--c-text-secondary)',
                    boxShadow: inputMode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {m === 'choice' ? '🅰️ Opción múltiple' : '✏️ Trazado'}
                </button>
              ))}
            </div>
          </div>

          {/* Time Attack */}
          <motion.button
            onClick={() => handlePlay('time-attack')}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 20,
              padding: '28px 24px',
              background: 'linear-gradient(135deg, #0071E3 0%, #30D158 100%)',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 8px 32px rgba(0,113,227,0.3)',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏱️</div>
            <div style={{
              fontFamily: 'var(--font-family)',
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 6,
            }}>Contrarreloj</div>
            <div style={{
              fontFamily: 'var(--font-family)',
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: 16,
            }}>60 segundos. ¿Cuántos caracteres puedes completar?</div>
            {personalBests['time-attack'] !== undefined && (
              <div style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 99,
                padding: '4px 14px',
                fontFamily: 'var(--font-family)',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
              }}>
                🏆 Récord: {personalBests['time-attack']}
              </div>
            )}
          </motion.button>

          {/* Bomb Mode */}
          <motion.button
            onClick={() => handlePlay('bomb-mode')}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 20,
              padding: '28px 24px',
              background: 'linear-gradient(135deg, #FF375F 0%, #FF9F0A 100%)',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 8px 32px rgba(255,55,95,0.3)',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>💣</div>
            <div style={{
              fontFamily: 'var(--font-family)',
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 6,
            }}>Modo Bomba</div>
            <div style={{
              fontFamily: 'var(--font-family)',
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: 16,
            }}>Un error y BOOM. Cada acierto añade tiempo. ¿Hasta dónde llegas?</div>
            {personalBests['bomb-mode'] !== undefined && (
              <div style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 99,
                padding: '4px 14px',
                fontFamily: 'var(--font-family)',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
              }}>
                🏆 Récord: {personalBests['bomb-mode']}
              </div>
            )}
          </motion.button>

          {/* Info footer */}
          <p style={{
            fontFamily: 'var(--font-family)',
            fontSize: 13,
            color: 'var(--c-text-tertiary)',
            textAlign: 'center',
            margin: 0,
          }}>
            Los puntos obtenidos en los juegos se suman a tu XP total
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GamesScreen;
