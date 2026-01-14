import React from 'react';
import { 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonButton, 
  IonIcon,
  IonRippleEffect 
} from '@ionic/react';
import { checkmarkCircle, refreshCircle } from 'ionicons/icons';
import styles from './ActionButtons.module.css';

interface ActionButtonsProps {
  onCorrect: () => void;
  onRepeat: () => void;
  isLoading?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCorrect,
  onRepeat,
  isLoading = false
}) => {
  return (
    <div className={styles.container}>
      <IonGrid className={styles.grid}>
        <IonRow className={styles.row}>
          <IonCol size="6" className={styles.col}>
            <IonButton
              expand="block"
              color="success"
              onClick={onCorrect}
              disabled={isLoading}
              className={`${styles.button} ${styles.correctButton}`}
              aria-label="Mark as correct"
            >
              <IonIcon 
                icon={checkmarkCircle} 
                slot="start" 
                className={styles.buttonIcon}
              />
              Correcto
              <IonRippleEffect />
            </IonButton>
          </IonCol>
          
          <IonCol size="6" className={styles.col}>
            <IonButton
              expand="block"
              color="warning"
              onClick={onRepeat}
              disabled={isLoading}
              className={`${styles.button} ${styles.repeatButton}`}
              aria-label="Mark for repetition"
            >
              <IonIcon 
                icon={refreshCircle} 
                slot="start" 
                className={styles.buttonIcon}
              />
              Repetir
              <IonRippleEffect />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default ActionButtons;