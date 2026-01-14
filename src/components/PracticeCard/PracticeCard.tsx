import React, { useRef, useState } from 'react';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    onDrawStart?.();
  };
  
  const handleTouchEnd = () => {
    setIsDrawing(false);
    onDrawEnd?.();
  };
  
  return (
    <div className={styles.cardContainer}>
      <div className={styles.practiceCard}>
        {/* Marca de agua del carácter */}
        <div className={styles.watermark}>
          {watermarkCharacter}
        </div>
        
        {/* Líneas guía */}
        <div className={styles.guideLines}>
          <div className={styles.diagonalGuide} />
          <div className={styles.verticalGuide} />
          <div className={styles.horizontalGuide} />
          <div className={styles.centerDot} />
        </div>
        
        {/* Canvas para dibujo futuro */}
        <canvas
          ref={canvasRef}
          className={styles.drawingCanvas}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
        />
        
        {/* Indicador de área interactiva */}
        <div className={styles.instruction}>
          {isDrawing ? 'Drawing...' : 'Trace the character here'}
        </div>
      </div>
    </div>
  );
};

export default PracticeCard;