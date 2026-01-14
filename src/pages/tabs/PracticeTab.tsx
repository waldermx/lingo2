// src/pages/tabs/PracticeTab.tsx
import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButton,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './TabStyles.css';

const PracticeTab: React.FC = () => {
  const history = useHistory();

  const handleStartPractice = () => {
    history.push('/practice');
  };

  return (
    <IonPage>
      <IonHeader className="tab-header">
        <IonToolbar>
          <IonTitle>Practice</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="tab-content">
        <div className="tab-container">
          {/* Botón principal */}
          <div className="practice-button-container">
            <IonButton 
              expand="block" 
              className="start-practice-button"
              onClick={handleStartPractice}
              size="large"
            >
              Start Practice
            </IonButton>
          </div>

          {/* Resumen ficticio */}
          <IonCard className="progress-summary-card">
            <IonCardContent>
              <h3 className="summary-title">Today's Progress</h3>
              
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <div className="stat-item">
                      <div className="stat-value">12</div>
                      <div className="stat-label">Characters</div>
                      <div className="stat-subtext">studied today</div>
                    </div>
                  </IonCol>
                  
                  <IonCol>
                    <div className="stat-item">
                      <div className="stat-value">25m</div>
                      <div className="stat-label">Study Time</div>
                      <div className="stat-subtext">total today</div>
                    </div>
                  </IonCol>
                </IonRow>
                
                <IonRow>
                  <IonCol>
                    <div className="stat-item">
                      <div className="stat-value">92%</div>
                      <div className="stat-label">Accuracy</div>
                      <div className="stat-subtext">average today</div>
                    </div>
                  </IonCol>
                  
                  <IonCol>
                    <div className="stat-item">
                      <div className="stat-value">HSK 1</div>
                      <div className="stat-label">Current Level</div>
                      <div className="stat-subtext">15/150 characters</div>
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

export default PracticeTab;