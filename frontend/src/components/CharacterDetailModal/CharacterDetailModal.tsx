import React, { useRef, useEffect } from 'react';
import {
  IonModal,
  IonContent,
  IonButton,
} from '@ionic/react';
import HanziWriter from 'hanzi-writer';
import styles from './CharacterDetailModal.module.css';

interface CharacterDetail {
  id: string;
  character: string;
  pinyin: string;
  definition: string;
  hskLevel?: number;
  examples?: Array<{ sentenceZh: string; sentenceTranslation: string }>;
  cardState?: string;
}

interface Props {
  character: CharacterDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

const TONE_COLORS = ['var(--tone-1)', 'var(--tone-2)', 'var(--tone-3)', 'var(--tone-4)', 'var(--tone-5)'];

function toneColorForPinyin(pinyin: string): string {
  if (/[āēīōūǖ]/.test(pinyin)) return TONE_COLORS[0];
  if (/[áéíóúǘ]/.test(pinyin)) return TONE_COLORS[1];
  if (/[ǎěǐǒǔǚ]/.test(pinyin)) return TONE_COLORS[2];
  if (/[àèìòùǜ]/.test(pinyin)) return TONE_COLORS[3];
  return TONE_COLORS[4];
}

function openPleco(character: string) {
  const plecoUrl = `plecoapi://x-callback-url/s?q=${encodeURIComponent(character)}`;
  const mdbgUrl = `https://www.mdbg.net/chinese/dictionary?wdqb=${encodeURIComponent(character)}`;
  // Try Pleco deep link; if it fails (web), open MDBG fallback
  try {
    window.location.href = plecoUrl;
    // Fallback: if not on mobile, open MDBG after a short delay
    setTimeout(() => {
      if (document.visibilityState !== 'hidden') window.open(mdbgUrl, '_blank', 'noopener');
    }, 800);
  } catch {
    window.open(mdbgUrl, '_blank', 'noopener');
  }
}

const CharacterDetailModal: React.FC<Props> = ({ character, isOpen, onClose }) => {
  const writerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !character || !writerContainerRef.current) return;
    const el = writerContainerRef.current;
    while (el.firstChild) el.removeChild(el.firstChild);
    const cs = getComputedStyle(document.documentElement);
    const writer = HanziWriter.create(el, character.character, {
      width: 140,
      height: 140,
      padding: 8,
      showOutline: true,
      showCharacter: true,
      outlineColor: cs.getPropertyValue('--c-bg-tertiary').trim(),
      strokeColor: cs.getPropertyValue('--c-text').trim(),
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 300,
      onLoadCharDataError: (reason) => console.error('HanziWriter data load error:', reason),
    });
    return () => { writer.pauseAnimation(); };
  }, [isOpen, character]);

  if (!character) return null;

  const toneColor = toneColorForPinyin(character.pinyin);

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.65}
      breakpoints={[0, 0.65, 0.9]}
      handle
      className={styles.modal}
    >
      <IonContent className={styles.content} scrollY>
        <div className={styles.body}>
          {/* Header row */}
          <div className={styles.headerRow}>
            <div className={styles.charBlock}>
              <span className={styles.hanzi}>{character.character}</span>
              <span className={styles.pinyin} style={{ color: toneColor }}>
                {character.pinyin}
              </span>
            </div>
            <div ref={writerContainerRef} className={styles.writer} />
          </div>

          {/* HSK badge */}
          {character.hskLevel != null && (
            <span className={styles.hskBadge}>HSK {character.hskLevel}</span>
          )}

          {/* Definition */}
          <p className={styles.definition}>{character.definition}</p>

          {/* Examples */}
          {character.examples && character.examples.length > 0 && (
            <div className={styles.examples}>
              <span className={styles.sectionTitle}>Ejemplos</span>
              {character.examples.map((ex, i) => (
                <div key={i} className={styles.exampleRow}>
                  <span className={styles.exampleZh}>{ex.sentenceZh}</span>
                  <span className={styles.exampleTrans}>{ex.sentenceTranslation}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pleco button */}
          <IonButton
            expand="block"
            fill="outline"
            className={styles.plecoBtn}
            onClick={() => openPleco(character.character)}
          >
            📖 Abrir en Pleco / MDBG
          </IonButton>

          <IonButton
            expand="block"
            fill="clear"
            color="medium"
            onClick={onClose}
            className={styles.closeBtn}
          >
            Cerrar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default CharacterDetailModal;
