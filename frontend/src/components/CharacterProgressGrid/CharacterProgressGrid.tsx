import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CharacterCard, DisplayState } from '../../stores/charactersStore';
import styles from './CharacterProgressGrid.module.css';

const STATE_COLORS: Record<DisplayState, string> = {
  new:      'var(--card-new)',
  learning: 'var(--card-learning)',
  fresh:    'var(--card-fresh)',
  due:      'var(--card-due)',
  overdue:  'var(--card-overdue)',
  mastered: 'var(--card-mastered)',
};

const STATE_LABELS: Record<DisplayState, string> = {
  new:      'Sin estudiar',
  learning: 'Aprendiendo',
  fresh:    'Fresco',
  due:      'Para hoy',
  overdue:  'Vencido',
  mastered: 'Dominado',
};

function resolveDisplayState(card: CharacterCard): DisplayState {
  if (card.cardState === 'new') return 'new';
  if (card.cardState === 'learning') return 'learning';
  const now = Date.now();
  const due = card.dueDate ? new Date(card.dueDate).getTime() : now;
  const twoDays = 2 * 24 * 3600 * 1000;
  if (card.stability >= 30) return 'mastered';
  if (now < due - twoDays) return 'fresh';
  if (now <= due) return 'due';
  return 'overdue';
}

interface Props {
  cards: CharacterCard[];
  onTap?: (card: CharacterCard) => void;
}

const CharacterProgressGrid: React.FC<Props> = ({ cards, onTap }) => {
  const stateCounts = useMemo(() => {
    const counts: Record<DisplayState, number> = {
      new: 0, learning: 0, fresh: 0, due: 0, overdue: 0, mastered: 0,
    };
    for (const c of cards) counts[resolveDisplayState(c)]++;
    return counts;
  }, [cards]);

  return (
    <div className={styles.container}>
      {/* Legend */}
      <div className={styles.legend}>
        {(Object.keys(STATE_LABELS) as DisplayState[]).map((state) => (
          <div key={state} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: STATE_COLORS[state] }} />
            <span className={styles.legendLabel}>{STATE_LABELS[state]}</span>
            <span className={styles.legendCount}>{stateCounts[state]}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {cards.map((card, i) => {
          const state = resolveDisplayState(card);
          return (
            <motion.button
              key={card.characterId}
              className={styles.chip}
              style={{ background: STATE_COLORS[state] }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.008, 0.5) }}
              whileTap={{ scale: 0.88 }}
              onClick={() => onTap?.(card)}
              aria-label={`${card.character} — ${STATE_LABELS[state]}`}
            >
              {card.character}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterProgressGrid;
