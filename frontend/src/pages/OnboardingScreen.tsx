import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiFetch from '../services/api';
import { useUserStore } from '../stores/userStore';

type Step = 'language' | 'hsk' | 'goal';

const STEPS: Step[] = ['language', 'hsk', 'goal'];

const OnboardingScreen: React.FC = () => {
  const history = useHistory();
  const { setUser } = useUserStore();
  const [step, setStep] = useState<Step>('language');
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const [hskLevel, setHskLevel] = useState<1 | 2>(1);
  const [dailyCards, setDailyCards] = useState<5 | 10 | 20>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stepIndex = STEPS.indexOf(step);

  const next = () => {
    if (step === 'language') setStep('hsk');
    else if (step === 'hsk') setStep('goal');
  };

  const finish = async () => {
    setError('');
    setLoading(true);
    try {
      await apiFetch('/onboarding', {
        method: 'POST',
        body: JSON.stringify({
          startingHSKLevel: hskLevel,
          preferredLocale: locale,
          dailyNewCards: dailyCards,
        }),
      });
      setUser({ onboardingCompleted: true, preferredLocale: locale, dailyGoal: dailyCards, hskLevel });
      history.replace('/tabs/practice');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar preferencias');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '48px 24px 32px',
          background: 'var(--c-bg)',
          maxWidth: 480,
          margin: '0 auto',
        }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{
                width: i === stepIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i <= stepIndex ? 'var(--c-blue)' : 'var(--c-separator)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'language' && (
              <motion.div
                key="language"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1 }}
              >
                <h2 style={headingStyle}>¿En qué idioma prefieres aprender?</h2>
                <p style={subStyle}>Las definiciones y ejemplos se mostrarán en este idioma.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
                  <OptionCard
                    emoji="🇪🇸"
                    label="Español"
                    selected={locale === 'es'}
                    onClick={() => setLocale('es')}
                  />
                  <OptionCard
                    emoji="🇬🇧"
                    label="English"
                    selected={locale === 'en'}
                    onClick={() => setLocale('en')}
                  />
                </div>
                <button onClick={next} style={{ ...primaryBtnStyle, marginTop: 'auto', marginBottom: 0 }}>
                  Continuar
                </button>
              </motion.div>
            )}

            {step === 'hsk' && (
              <motion.div
                key="hsk"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1 }}
              >
                <h2 style={headingStyle}>¿Cuál es tu nivel?</h2>
                <p style={subStyle}>El HSK es el sistema oficial de niveles de chino mandarín.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
                  <OptionCard
                    emoji="🌱"
                    label="HSK 1 — Principiante"
                    description="150 caracteres básicos. Perfecto si empiezas desde cero."
                    selected={hskLevel === 1}
                    onClick={() => setHskLevel(1)}
                  />
                  <OptionCard
                    emoji="🌿"
                    label="HSK 2 — Elemental"
                    description="300 caracteres. Conoces los fundamentos y quieres avanzar."
                    selected={hskLevel === 2}
                    onClick={() => setHskLevel(2)}
                  />
                </div>
                <button onClick={next} style={{ ...primaryBtnStyle, marginTop: 'auto' }}>
                  Continuar
                </button>
              </motion.div>
            )}

            {step === 'goal' && (
              <motion.div
                key="goal"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1 }}
              >
                <h2 style={headingStyle}>¿Cuántos caracteres nuevos al día?</h2>
                <p style={subStyle}>Puedes cambiar esto más adelante en ajustes.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
                  <OptionCard
                    emoji="🐢"
                    label="5 al día"
                    description="Ritmo suave, ideal si tienes poco tiempo."
                    selected={dailyCards === 5}
                    onClick={() => setDailyCards(5)}
                  />
                  <OptionCard
                    emoji="🚶"
                    label="10 al día"
                    description="Ritmo equilibrado, recomendado para la mayoría."
                    selected={dailyCards === 10}
                    onClick={() => setDailyCards(10)}
                  />
                  <OptionCard
                    emoji="🏃"
                    label="20 al día"
                    description="Avance rápido para estudiantes dedicados."
                    selected={dailyCards === 20}
                    onClick={() => setDailyCards(20)}
                  />
                </div>
                {error && (
                  <p style={{ color: 'var(--c-red)', fontSize: 13, fontFamily: 'var(--font-family)', textAlign: 'center', marginTop: 12 }}>{error}</p>
                )}
                <button onClick={finish} disabled={loading} style={{ ...primaryBtnStyle, marginTop: 'auto' }}>
                  {loading ? 'Guardando…' : '¡Empezar a aprender!'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </IonContent>
    </IonPage>
  );
};

interface OptionCardProps {
  emoji: string;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ emoji, label, description, selected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      padding: '16px',
      borderRadius: 14,
      border: `2px solid ${selected ? 'var(--c-blue)' : 'var(--c-separator)'}`,
      background: selected ? 'var(--c-blue-light)' : 'var(--c-bg-secondary)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s ease',
    }}
  >
    <span style={{ fontSize: 28, lineHeight: 1 }}>{emoji}</span>
    <div>
      <div style={{ fontFamily: 'var(--font-family)', fontSize: 15, fontWeight: 600, color: 'var(--c-text)' }}>{label}</div>
      {description && <div style={{ fontFamily: 'var(--font-family)', fontSize: 13, color: 'var(--c-text-secondary)', marginTop: 2 }}>{description}</div>}
    </div>
  </button>
);

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 26,
  fontWeight: 700,
  color: 'var(--c-text)',
  margin: 0,
  lineHeight: 1.2,
};

const subStyle: React.CSSProperties = {
  fontFamily: 'var(--font-family)',
  fontSize: 15,
  color: 'var(--c-text-secondary)',
  margin: '10px 0 0',
};

const primaryBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '15px',
  borderRadius: 14,
  border: 'none',
  background: 'var(--c-blue)',
  color: '#fff',
  fontFamily: 'var(--font-family)',
  fontSize: 16,
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: 32,
};

export default OnboardingScreen;
