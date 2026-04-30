// src/pages/tabs/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import XPBar from '../../components/XPBar/XPBar';
import StreakWidget from '../../components/StreakWidget/StreakWidget';
import AchievementCard from '../../components/AchievementCard/AchievementCard';

const AVATAR_OPTIONS = [
  { id: 'panda', emoji: '🐼' },
  { id: 'dragon', emoji: '🐉' },
  { id: 'tiger', emoji: '🐯' },
  { id: 'rabbit', emoji: '🐰' },
  { id: 'fox', emoji: '🦊' },
  { id: 'owl', emoji: '🦉' },
  { id: 'phoenix', emoji: '🦅' },
  { id: 'turtle', emoji: '🐢' },
];

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 9000, 13000];

function xpInCurrentLevel(xpTotal: number, level: number): number {
  const base = LEVEL_THRESHOLDS[level - 1] ?? 0;
  return xpTotal - base;
}

function xpNeededForLevel(level: number): number {
  const base = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level] ?? base + 5000;
  return next - base;
}

const ProfileScreen: React.FC = () => {
  const {
    displayName,
    avatarId,
    xpTotal,
    level,
    xpToNextLevel,
    streakDays,
    longestStreak,
    totalReviews,
    charactersMastered,
    lifetimeAccuracy,
    achievements,
    activityHeatmap,
    dailyGoal,
    setAvatar,
    setUser,
    logout,
  } = useUserStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(displayName);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === avatarId)?.emoji ?? '🐼';

  // Build heatmap for last 90 days
  const heatmapDays = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(Date.now() - (89 - i) * 86400000);
    const key = d.toISOString().split('T')[0];
    return { key, count: activityHeatmap[key] ?? 0 };
  });

  const xpInLevel = xpInCurrentLevel(xpTotal, level);
  const xpNeeded = xpNeededForLevel(level);
  const levelProgress = Math.min(xpInLevel / xpNeeded, 1);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Profile header */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: '24px',
            background: 'var(--c-surface)',
            borderRadius: 20,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            {/* Avatar */}
            <motion.button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              whileTap={{ scale: 0.92 }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                border: '3px solid var(--c-blue)',
                background: 'var(--c-blue-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 44,
                cursor: 'pointer',
              }}
            >
              {currentAvatar}
            </motion.button>

            {/* Avatar picker */}
            <AnimatePresence>
              {showAvatarPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', width: '100%' }}
                >
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'center',
                    paddingTop: 8,
                  }}>
                    {AVATAR_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.id}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => { setAvatar(opt.id); setShowAvatarPicker(false); }}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 26,
                          border: avatarId === opt.id ? '2px solid var(--c-blue)' : '2px solid transparent',
                          background: avatarId === opt.id ? 'var(--c-blue-bg)' : 'var(--c-bg-secondary)',
                          fontSize: 28,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {opt.emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name */}
            {editingName ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  value={nameInput}
                  onInput={(e) => setNameInput((e.target as HTMLInputElement).value)}
                  style={{
                    fontFamily: 'var(--font-family)',
                    fontSize: 20,
                    fontWeight: 700,
                    border: '2px solid var(--c-blue)',
                    borderRadius: 10,
                    padding: '6px 12px',
                    outline: 'none',
                    background: 'var(--c-bg)',
                    color: 'var(--c-text)',
                    textAlign: 'center',
                    width: 180,
                  }}
                  autoFocus
                />
                <button
                  onClick={() => { setUser({ displayName: nameInput }); setEditingName(false); }}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--c-blue)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontFamily: 'var(--font-family)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Guardar
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setNameInput(displayName); setEditingName(true); }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-family)',
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--c-text)',
                  cursor: 'pointer',
                }}
              >
                {displayName} ✏️
              </button>
            )}

            {/* XP Bar */}
            <div style={{ width: '100%', paddingTop: 4 }}>
              <XPBar xpTotal={xpTotal} level={level} xpToNextLevel={xpToNextLevel} />
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12,
          }}>
            {[
              { label: 'Reseñas', value: totalReviews, emoji: '📖' },
              { label: 'Dominados', value: charactersMastered, emoji: '✅' },
              { label: 'Precisión', value: `${Math.round(lifetimeAccuracy * 100)}%`, emoji: '🎯' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'var(--c-surface)',
                  borderRadius: 16,
                  padding: '16px 8px',
                  textAlign: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{stat.emoji}</div>
                <div style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 20,
                  fontWeight: 800,
                  color: 'var(--c-text)',
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: 'var(--font-family)',
                  fontSize: 11,
                  color: 'var(--c-text-secondary)',
                }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Streak */}
          <div style={{
            background: 'var(--c-surface)',
            borderRadius: 20,
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-family)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--c-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 4,
              }}>Racha actual</div>
              <div style={{
                fontFamily: 'var(--font-family)',
                fontSize: 28,
                fontWeight: 800,
              }}>🔥 {streakDays} días</div>
              <div style={{
                fontFamily: 'var(--font-family)',
                fontSize: 13,
                color: 'var(--c-text-secondary)',
                marginTop: 2,
              }}>Máxima racha: {longestStreak} días</div>
            </div>
            <StreakWidget streak={streakDays} longest={longestStreak} compact />
          </div>

          {/* Activity heatmap */}
          <div style={{
            background: 'var(--c-surface)',
            borderRadius: 20,
            padding: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
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
                const intensity = day.count === 0 ? 0 : day.count < 3 ? 1 : day.count < 6 ? 2 : 3;
                const bg = intensity === 0
                  ? 'var(--c-bg-tertiary)'
                  : intensity === 1
                  ? 'rgba(0,113,227,0.25)'
                  : intensity === 2
                  ? 'rgba(0,113,227,0.55)'
                  : 'var(--c-blue)';
                return (
                  <div
                    key={day.key}
                    title={`${day.key}: ${day.count} reseñas`}
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

          {/* Achievements */}
          <div>
            <div style={{
              fontFamily: 'var(--font-family)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--c-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 12,
            }}>Logros ({unlockedCount}/{achievements.length})</div>
            {achievements.length === 0 ? (
              <div style={{
                background: 'var(--c-surface)',
                borderRadius: 16,
                padding: '24px',
                textAlign: 'center',
                color: 'var(--c-text-secondary)',
                fontFamily: 'var(--font-family)',
                fontSize: 14,
              }}>
                Los logros aparecerán aquí a medida que avances 🏆
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}>
                {achievements.map((a) => (
                  <AchievementCard key={a.id} achievement={a} />
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '14px',
              background: 'none',
              border: '1.5px solid var(--c-separator)',
              borderRadius: 14,
              fontFamily: 'var(--font-family)',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--c-red)',
              cursor: 'pointer',
              marginBottom: 24,
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileScreen;
