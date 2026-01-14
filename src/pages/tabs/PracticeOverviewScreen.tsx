// src/pages/tabs/PracticeOverviewScreen.tsx - REEMPLAZA PracticeTab.tsx
import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';

import { useHistory } from 'react-router-dom';
import './TabStyles.css';

const PracticeOverviewScreen: React.FC = () => {
  const history = useHistory();

  const handleStartPractice = () => {
    history.push('/practice');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Práctica</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div className="tab-container">
          {/* Botón principal */}
          <div className="practice-button-container">
            <IonButton 
              expand="block" 
              className="start-practice-button"
              onClick={handleStartPractice}
              size="large"
            >
              ¡Inicia a practicar!
            </IonButton>
          </div>

          {/* Resumen ficticio */}
          <IonCard className="progress-summary-card">
            <IonCardContent>
              <h3 className="summary-title">Progreso de hoy</h3>
              
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <div className="stat-item">
                      <div className="stat-value">12</div>
                      <div className="stat-label">Caracteres</div>
                      <div className="stat-subtext">estudiados hoy</div>
                    </div>
                  </IonCol>
                  
                  <IonCol>
                    <div className="stat-item">
                      <div className="stat-value">25m</div>
                      <div className="stat-label">Tiempo de estudio</div>
                      <div className="stat-subtext">total hoy</div>
                    </div>
                  </IonCol>
                </IonRow>
                
                <IonRow>
                  <IonCol>
                    <div className="stat-item">
                      <div className="stat-value">92%</div>
                      <div className="stat-label">Precisión</div>
                      <div className="stat-subtext">promedio hoy</div>
                    </div>
                  </IonCol>
                  
                  <IonCol>
                    <div className="stat-item">
                      <div className="stat-value">HSK 1</div>
                      <div className="stat-label">Nivel actual</div>
                      <div className="stat-subtext">15/150 caracteres</div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PracticeOverviewScreen;