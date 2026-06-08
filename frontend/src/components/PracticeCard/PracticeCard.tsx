// src/components/PracticeCard/PracticeCard.tsx - VERSIÓN CORREGIDA
import React, { useRef, useEffect, useState } from 'react';
import HanziWriter, { HanziWriterInstance } from 'hanzi-writer';
import styles from './PracticeCard.module.css';

interface PracticeCardProps {
  watermarkCharacter: string;
  onDrawStart?: () => void;
  onDrawEnd?: () => void;
}

const PracticeCard: React.FC<PracticeCardProps> = ({
  watermarkCharacter,
  onDrawStart,
  onDrawEnd
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriterInstance | null>(null);
  const [isWriterReady, setIsWriterReady] = useState(false);

  // Inicializar Hanzi Writer cuando el componente se monta
  useEffect(() => {
    if (!containerRef.current || !watermarkCharacter) return;
    const container = containerRef.current;

    const initWriter = async () => {
      try {
        // Limpiar instancia anterior de manera segura
        if (writerRef.current && typeof writerRef.current === 'object') {
          // Método seguro para limpiar sin acceder a propiedades internas
          const container = containerRef.current;
          if (container) {
            // Limpiar el contenido del contenedor
            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }
          }
          writerRef.current = null;
        }

        // Crear nuevo contenedor para el writer
        const writerContainer = containerRef.current;
        if (!writerContainer) return;

        // Esperar a que el contenedor tenga dimensiones
        await new Promise(resolve => setTimeout(resolve, 100));

        // Crear nueva instancia de Hanzi Writer
        const cs = getComputedStyle(document.documentElement);
        writerRef.current = HanziWriter.create(writerContainer, watermarkCharacter, {
          width: writerContainer.offsetWidth || 300,
          height: writerContainer.offsetHeight || 300,
          padding: 8,
          showOutline: true,
          showCharacter: false,
          outlineColor: cs.getPropertyValue('--c-bg-tertiary').trim() || '#EBEBF0',
          strokeColor: cs.getPropertyValue('--c-text').trim() || '#1D1D1F',
          radicalColor: null,
          strokeFadeDuration: 400,
          strokeHighlightSpeed: 2,
          drawingWidth: 40,
          strokeWidth: 5,
          drawingFadeDuration: 300,
          drawingColor: cs.getPropertyValue('--c-green').trim() || '#30D158',
          showHintAfterMisses: 3,
          highlightOnComplete: true,
          highlightColor: cs.getPropertyValue('--c-green').trim() || '#30D158',
          delayBetweenStrokes: 400,
          strokeAnimationSpeed: 1.5,
          onLoadCharDataError: (reason) => console.error('HanziWriter data load error:', reason),
        });

        // Iniciar el modo quiz
        if (writerRef.current && typeof writerRef.current.quiz === 'function') {
          writerRef.current.quiz({
            onMistake: () => {
              onDrawStart?.();
            },
            onComplete: () => {
              onDrawEnd?.();
            }
          });
        }

        setIsWriterReady(true);
      } catch (error) {
        console.error('Error initializing Hanzi Writer:', error);
        setIsWriterReady(false);
      }
    };

    initWriter();

    // Limpiar al desmontar
    return () => {
      setIsWriterReady(false);
      
      // Limpiar de manera segura sin acceder a propiedades internas
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
      
      writerRef.current = null;
    };
  }, [watermarkCharacter, onDrawStart, onDrawEnd]);

  // Manejar redimensionamiento
  useEffect(() => {
    const handleResize = () => {
      if (writerRef.current && 
          typeof writerRef.current === 'object' && 
          writerRef.current.updateDimensions && 
          containerRef.current) {
        
        // Solo actualizar si el writer está listo
        setTimeout(() => {
          if (containerRef.current && writerRef.current) {
            writerRef.current.updateDimensions({
              width: containerRef.current.offsetWidth,
              height: containerRef.current.offsetHeight
            });
          }
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // También actualizar cuando el componente se monta
    const timeoutId = setTimeout(handleResize, 500);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isWriterReady]);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.practiceCard}>
        {/* Contenedor para Hanzi Writer */}
        <div
          ref={containerRef}
          className={styles.writerContainer}
          style={{ cursor: 'crosshair', touchAction: 'none' }}
          aria-label={`Practice writing the character ${watermarkCharacter}`}
          role="application"
        />

        {/* Líneas guía - SUPERPUESTAS sobre Hanzi Writer */}
        <div className={styles.guideLines}>
          <div className={styles.diagonalGuide} />
          <div className={styles.verticalGuide} />
          <div className={styles.horizontalGuide} />
          <div className={styles.centerDot} />
        </div>

      </div>
    </div>
  );
};

export default PracticeCard;