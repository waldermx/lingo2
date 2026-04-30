import React from 'react';
import { motion } from 'framer-motion';
import styles from './XPBar.module.css';

interface Props {
  xpTotal: number;
  level: number;
  xpToNextLevel: number;
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 9000, 13000];

function getCurrentLevelXP(level: number, xpTotal: number): number {
  const base = LEVEL_THRESHOLDS[level - 1] ?? 0;
  return xpTotal - base;
}

function getLevelSize(level: number): number {
  const base = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level] ?? base + 5000;
  return next - base;
}

const XPBar: React.FC<Props> = ({ xpTotal, level, xpToNextLevel }) => {
  const currentLevelXP = getCurrentLevelXP(level, xpTotal);
  const levelSize = getLevelSize(level);
  const progress = Math.min(currentLevelXP / levelSize, 1);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.levelBadge}>
          <span className={styles.levelLabel}>Nivel</span>
          <span className={styles.levelNum}>{level}</span>
        </div>
        <span className={styles.xpText}>{xpToNextLevel} XP para nivel {level + 1}</span>
      </div>
      <div className={styles.track}>
        <motion.div
          className={styles.fill}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className={styles.footer}>
        <span className={styles.totalXP}>{xpTotal.toLocaleString()} XP total</span>
      </div>
    </div>
  );
};

export default XPBar;
