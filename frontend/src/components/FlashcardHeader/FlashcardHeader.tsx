// src/components/FlashcardHeader/FlashcardHeader.tsx - VERSIÓN SIMPLIFICADA
import React from 'react';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonTitle, 
  IonIcon 
} from '@ionic/react';
import { arrowBack, book } from 'ionicons/icons';
import styles from './FlashcardHeader.module.css';

interface FlashcardHeaderProps {
  moduleName: string;
  onBack: () => void;
  progress?: number;
}

const FlashcardHeader: React.FC<FlashcardHeaderProps> = ({
  moduleName,
  onBack,
  progress = 0
}) => {
  return (
    <IonHeader className={styles.header}>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton 
            onClick={onBack}
            fill="clear"
            aria-label="Go back"
            className={styles.backButton}
          >
            <IonIcon icon={arrowBack} slot="icon-only" />
          </IonButton>
        </IonButtons>
        
        <IonTitle className={styles.title}>
          <IonIcon icon={book} className={styles.moduleIcon} />
          {moduleName}
        </IonTitle>
        
        {progress > 0 && (
          <div className={styles.progressContainer} slot="end">
            <div className={styles.progressText}>
              {Math.round(progress)}%
            </div>
          </div>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default FlashcardHeader;