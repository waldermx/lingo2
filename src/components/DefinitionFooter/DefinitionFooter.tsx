import React from 'react';
import styles from './DefinitionFooter.module.css';

interface DefinitionFooterProps {
  character: string;
  pinyin: string;
  definition: string;
  example?: string;
}

const DefinitionFooter: React.FC<DefinitionFooterProps> = ({
  character,
  pinyin,
  definition,
  example
}) => {
  return (
    <div className={styles.footer}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.characterSmall}>{character}</div>
          <div className={styles.pinyinSmall}>{pinyin}</div>
        </div>
        
        <div className={styles.definition}>
          {definition}
        </div>
        
        {example && (
          <div className={styles.example}>
            <div className={styles.exampleLabel}>Example:</div>
            <div className={styles.exampleText}>{example}</div>
          </div>
        )}
        
        <div className={styles.hint}>
          💡 Long press character for details
        </div>
      </div>
    </div>
  );
};

export default DefinitionFooter;