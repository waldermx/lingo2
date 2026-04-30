import React from 'react';
import { motion } from 'framer-motion';
import type { Achievement } from '../../stores/userStore';
import styles from './AchievementCard.module.css';

interface Props {
  achievement: Achievement;
  onTap?: (a: Achievement) => void;
}

const AchievementCard: React.FC<Props> = ({ achievement, onTap }) => {
  const { unlocked, iconEmoji, titleEs, xpReward } = achievement;

  return (
    <motion.button
      className={`${styles.card} ${unlocked ? styles.unlocked : styles.locked}`}
      whileTap={{ scale: 0.94 }}
      initial={unlocked ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      onClick={() => onTap?.(achievement)}
      aria-label={titleEs}
    >
      <span className={styles.icon}>{unlocked ? iconEmoji : '🔒'}</span>
      <span className={styles.title}>{titleEs}</span>
      {unlocked && (
        <span className={styles.xp}>+{xpReward} XP</span>
      )}
    </motion.button>
  );
};

export default AchievementCard;
