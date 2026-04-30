import React from 'react';
import styles from './CharacterDisplay.module.css';

interface CharacterDisplayProps {
  character: string;
  pinyin: string;
  showPinyin: boolean;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({
  character,
  pinyin,
  showPinyin
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.character}>
        {character}
      </div>
      {showPinyin && (
        <div className={styles.pinyin}>
          {pinyin}
        </div>
      )}
      {!showPinyin && (
        <div className={styles.pinyinPlaceholder}>
          Ver pronunciación
        </div>
      )}
    </div>
  );
};

export default CharacterDisplay;