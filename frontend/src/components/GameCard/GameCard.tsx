import React from 'react';
import { motion } from 'framer-motion';
import styles from './GameCard.module.css';

interface Props {
  title: string;
  tagline: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  personalBest?: number;
  personalBestLabel?: string;
  onPlay: () => void;
}

const GameCard: React.FC<Props> = ({
  title,
  tagline,
  emoji,
  gradientFrom,
  gradientTo,
  personalBest,
  personalBestLabel = 'Récord',
  onPlay,
}) => {
  return (
    <motion.div
      className={styles.card}
      style={{ background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className={styles.top}>
        <span className={styles.emoji}>{emoji}</span>
        {personalBest !== undefined && personalBest > 0 && (
          <span className={styles.record}>🏆 {personalBestLabel}: {personalBest}</span>
        )}
      </div>
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.tagline}>{tagline}</p>
      </div>
      <motion.button
        className={styles.playBtn}
        onClick={onPlay}
        whileTap={{ scale: 0.93 }}
      >
        Jugar
      </motion.button>
    </motion.div>
  );
};

export default GameCard;
