// src/pages/tabs/ProgressScreen.tsx
import React, { useMemo } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { motion } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { useCharactersStore } from '../../stores/charactersStore';
import CharacterProgressGrid from '../../components/CharacterProgressGrid/CharacterProgressGrid';

const HSK_TOTALS = [150, 150, 300, 600, 1200, 2500];

const ProgressScreen: React.FC = () => {
  const { activityHeatmap, hskLevel, charactersMastered } = useUserStore();
  const { cards } = useCharactersStore();

  const cardsList = useMemo(() => Object.values(cards), [cards]);

  // Heatmap last 90 days
  const heatmapDays = useMemo(() => Array.from({ length: 90 }, (_, i) => {
    const d = new Date(Date.now() - (89 - i) * 86400000);
    const key = d.toISOString().split('T')[0];
    return { key, count: activityHeatmap[key] ?? 0 };
  }), [activityHeatmap]);

  const maxDay = Math.max(1, ...heatmapDays.map((d) => d.count));

  // HSK progress bars (levels 1–6)
  const hskProgress = HSK_TOTALS.map((total, i) => {
    const lvl = i + 1;
    const learned = cardsList.filter(
      (c) => c.hskLevel === lvl && c.cardState !== 'new'
    ).length;
    return { level: lvl, learned, total };
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Progreso</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Character grid */}
          {cardsList.length > 0 ? (
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
              }}>Tus caracteres</div>
              <CharacterProgressGrid cards={cardsList} />
            </div>
          ) : (
            <div style={{
              background: 'var(--c-surface)',
              borderRadius: 20,
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p style={{ fontFamily: 'var(--font-family)', fontSize: 15, color: 'var(--c-text-secondary)', margin: 0 }}>
                Aún no has estudiado ningún carácter. ¡Comienza en la pestaña Práctica!
              </p>
            </div>
          )}

          {/* Activity heatmap */}
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
            }}>Actividad — últimos 90 días</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(18, 1fr)',
              gap: 3,
            }}>
              {heatmapDays.map((day) => {
                const rel = day.count / maxDay;
                const bg = day.count === 0
                  ? 'var(--c-bg-tertiary)'
                  : rel < 0.33
                  ? 'rgba(0,113,227,0.25)'
                  : rel < 0.66
                  ? 'rgba(0,113,227,0.55)'
                  : 'var(--c-blue)';
                return (
                  <div
                    key={day.key}
                    title={`${day.key}: ${day.count}`}
                    style={{
                      width: '100%',
                      paddingBottom: '100%',
                      borderRadius: 3,
                      background: bg,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* HSK progress bars */}
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
              marginBottom: 16,
            }}>Niveles HSK</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {hskProgress.map(({ level, learned, total }) => {
                const pct = learned / total;
                return (
                  <div key={level}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-family)',
                      fontSize: 13,
                      marginBottom: 4,
                    }}>
                      <span style={{ fontWeight: 600, color: level <= hskLevel ? 'var(--c-text)' : 'var(--c-text-tertiary)' }}>
                        HSK {level}
                      </span>
                      <span style={{ color: 'var(--c-text-secondary)' }}>
                        {learned} / {total}
                      </span>
                    </div>
                    <div style={{ height: 6, background: 'var(--c-bg-tertiary)', borderRadius: 99, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: level <= hskLevel ? 'var(--c-blue)' : 'var(--c-bg-secondary)',
                          borderRadius: 99,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProgressScreen;