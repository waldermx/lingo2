import React from 'react';
import { motion } from 'framer-motion';
import styles from './StreakWidget.module.css';

interface Props {
  streak: number;
  longest?: number;
  compact?: boolean;
}

const StreakWidget: React.FC<Props> = ({ streak, longest, compact = false }) => {
  const isActive = streak > 0;

  return (
    <div className={`${styles.wrapper} ${compact ? styles.compact : ''}`}>
      <motion.span
        className={styles.fire}
        animate={isActive ? {
          scale: [1, 1.15, 1],
          filter: ['drop-shadow(0 0 0px #FF9F0A)', 'drop-shadow(0 0 8px #FF9F0A)', 'drop-shadow(0 0 0px #FF9F0A)'],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        🔥
      </motion.span>
      <div className={styles.text}>
        <span className={styles.count}>{streak}</span>
        {!compact && <span className={styles.label}>{streak === 1 ? 'día' : 'días'}</span>}
      </div>
      {!compact && longest !== undefined && longest > 0 && (
        <span className={styles.best}>máx. {longest}</span>
      )}
    </div>
  );
};

export default StreakWidget;
