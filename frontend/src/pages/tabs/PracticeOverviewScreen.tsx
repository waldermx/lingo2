// src/pages/tabs/PracticeOverviewScreen.tsx
import React from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import DailyGoalRing from '../../components/DailyGoalRing/DailyGoalRing';
import StreakWidget from '../../components/StreakWidget/StreakWidget';
import XPBar from '../../components/XPBar/XPBar';

const PracticeOverviewScreen: React.FC = () => {
  const history = useHistory();
  const {
    displayName, streakDays, longestStreak,
    xpTotal, level, xpToNextLevel, dailyGoal,
    activityHeatmap, charactersMastered, lifetimeAccuracy,
  } = useUserStore();

  // Approximate daily goal progress from today's activity
  const todayKey = new Date().toISOString().split('T')[0];
  const todayCount = activityHeatmap[todayKey] ?? 0;
  const dailyProgress = Math.min(todayCount / dailyGoal, 1);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Práctica</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Greeting */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-family)',
              fontSize: 26,
              fontWeight: 800,
              color: 'var(--c-text)',
              margin: 0,
            }}>
              Hola, {displayName.split(' ')[0]} 👋
            </h2>
            <p style={{
              fontFamily: 'var(--font-family)',
              fontSize: 15,
              color: 'var(--c-text-secondary)',
              margin: '4px 0 0',
            }}>
              {streakDays > 0
                ? `Llevas ${streakDays} días seguidos. ¡Sigue así!`
                : '¡Comienza tu racha de estudio hoy!'}
            </p>
          </div>

          {/* Daily goal ring + streak */}
          <div style={{
            background: 'var(--c-surface)',
            borderRadius: 20,
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <DailyGoalRing
              progress={dailyProgress}
              label={`${todayCount}/${dailyGoal}`}
              sublabel="meta diaria"
              size={100}
            />
            <StreakWidget streak={streakDays} longest={longestStreak} compact />
          </div>

          {/* XP Bar */}
          <div style={{
            background: 'var(--c-surface)',
            borderRadius: 20,
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              fontFamily: 'var(--font-family)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--c-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 12,
            }}>Tu XP</div>
            <XPBar xpTotal={xpTotal} level={level} xpToNextLevel={xpToNextLevel} />
          </div>

          {/* Stats quick row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { emoji: '✅', value: charactersMastered, label: 'dominados' },
              { emoji: '🎯', value: `${Math.round(lifetimeAccuracy * 100)}%`, label: 'precisión' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: 'var(--c-surface)',
                  borderRadius: 16,
                  padding: '16px 12px',
                  textAlign: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ fontSize: 28 }}>{s.emoji}</div>
                <div style={{ fontFamily: 'var(--font-family)', fontSize: 22, fontWeight: 800, color: 'var(--c-text)', marginTop: 4 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--c-text-secondary)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => history.push('/learn')}
              style={{
                width: '100%',
                padding: '18px',
                background: 'var(--c-blue)',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                fontFamily: 'var(--font-family)',
                fontSize: 17,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,113,227,0.35)',
              }}
            >
              Aprender nuevo 📖
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => history.push('/quiz')}
              style={{
                width: '100%',
                padding: '18px',
                background: 'var(--c-surface)',
                color: 'var(--c-blue)',
                border: '2px solid var(--c-blue)',
                borderRadius: 16,
                fontFamily: 'var(--font-family)',
                fontSize: 17,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Practicar tarjetas 🔁
            </motion.button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PracticeOverviewScreen;