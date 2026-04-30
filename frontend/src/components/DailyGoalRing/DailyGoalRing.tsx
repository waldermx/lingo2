import React from 'react';
import { motion } from 'framer-motion';
import styles from './DailyGoalRing.module.css';

interface Props {
  progress: number; // 0–1
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}

const DailyGoalRing: React.FC<Props> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  color = 'var(--c-blue)',
}) => {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));
  const cx = size / 2;

  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.svg}>
        {/* Track */}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="var(--c-bg-tertiary)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </svg>
      <div className={styles.content}>
        {label && <span className={styles.label}>{label}</span>}
        {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
      </div>
    </div>
  );
};

export default DailyGoalRing;
