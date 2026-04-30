// src/pages/tabs/DictionaryScreen.tsx
import React, { useState, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
} from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { characterService, CharacterSearchResult } from '../../services/characterService';
import CharacterDetailModal from '../../components/CharacterDetailModal/CharacterDetailModal';

type CharacterResult = CharacterSearchResult;

const TONE_COLORS: Record<number, string> = {
  1: 'var(--tone-1)',
  2: 'var(--tone-2)',
  3: 'var(--tone-3)',
  4: 'var(--tone-4)',
};

function getToneColor(pinyin: string): string {
  const n = parseInt(pinyin.slice(-1));
  return TONE_COLORS[n] ?? 'var(--c-text)';
}

const DictionaryScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<CharacterResult | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleSearch = (val: string) => {
    setQuery(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(val.trim());
    }, 300);
  };

  const { data: results = [], isFetching } = useQuery<CharacterResult[]>({
    queryKey: ['dictionary', debouncedQuery],
    queryFn: () => characterService.searchByPinyin(debouncedQuery),
    enabled: debouncedQuery.length >= 1,
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Diccionario</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={query}
            onIonInput={(e) => handleSearch(e.detail.value ?? '')}
            placeholder="Buscar por pinyin, hanzi o significado…"
            debounce={0}
            style={{ '--border-radius': '12px' }}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {isFetching && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <IonSpinner name="crescent" />
          </div>
        )}

        {!isFetching && debouncedQuery.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 32px',
            gap: 16,
          }}>
            <div style={{ fontSize: 64 }}>🔍</div>
            <p style={{
              fontFamily: 'var(--font-family)',
              fontSize: 15,
              color: 'var(--c-text-secondary)',
              textAlign: 'center',
              margin: 0,
            }}>
              Busca un carácter en hanzi, su pinyin o significado en español
            </p>
          </div>
        )}

        {!isFetching && debouncedQuery.length > 0 && results.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px 32px',
            gap: 12,
          }}>
            <div style={{ fontSize: 48 }}>🈚</div>
            <p style={{
              fontFamily: 'var(--font-family)',
              fontSize: 15,
              color: 'var(--c-text-secondary)',
              textAlign: 'center',
              margin: 0,
            }}>Sin resultados para "{debouncedQuery}"</p>
          </div>
        )}

        <AnimatePresence>
          {results.length > 0 && (
            <IonList style={{ background: 'transparent', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((char, i) => (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div
                    onClick={() => setSelected(char)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '14px 16px',
                      background: 'var(--c-surface)',
                      borderRadius: 14,
                      cursor: 'pointer',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    <span style={{
                      fontSize: 40,
                      lineHeight: 1,
                      fontWeight: 800,
                      color: 'var(--c-text)',
                      minWidth: 48,
                      textAlign: 'center',
                    }}>{char.character}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 16,
                        fontWeight: 700,
                        color: getToneColor(char.pinyin),
                        marginBottom: 2,
                      }}>{char.pinyin}</div>
                      <div style={{
                        fontFamily: 'var(--font-family)',
                        fontSize: 13,
                        color: 'var(--c-text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{char.definition}</div>
                    </div>
                    {char.hskLevel && (
                      <span style={{
                        background: 'var(--c-blue-bg)',
                        color: 'var(--c-blue)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 99,
                      }}>HSK {char.hskLevel}</span>
                    )}
                    <span style={{ color: 'var(--c-text-tertiary)', fontSize: 18 }}>›</span>
                  </div>
                </motion.div>
              ))}
            </IonList>
          )}
        </AnimatePresence>

        {selected && (
          <CharacterDetailModal
            isOpen
            character={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default DictionaryScreen;
