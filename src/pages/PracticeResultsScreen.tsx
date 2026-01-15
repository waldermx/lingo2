// src/pages/PracticeResultsScreen.tsx
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
import { arrowBack, refresh, home } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import './PracticeResultsScreen.css';

interface LocationState {
  results: boolean[];
}

const PracticeResultsScreen: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const results = location.state?.results || [];
  const total = results.length;
  const correct = results.filter(Boolean).length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const handleRestart = () => {
    history.push('/quiz');
  };

  const handleBackToLearn = () => {
    history.push('/tabs/practice');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleBackToLearn}>
              <IonIcon icon={home} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Resultados</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="results-container">
          <IonCard className="results-card">
            <IonCardContent>
              <div className="results-header">
                <div className="results-icon">🎉</div>
                <h2>Práctica completada</h2>
                <p>Has terminado la sesión de práctica</p>
              </div>

              <div className="results-stats">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <div className="stat-box">
                        <div className="stat-number">{total}</div>
                        <div className="stat-label">Caracteres</div>
                      </div>
                    </IonCol>
                    <IonCol>
                      <div className="stat-box">
                        <div className="stat-number">{correct}</div>
                        <div className="stat-label">Correctos</div>
                      </div>
                    </IonCol>
                    <IonCol>
                      <div className="stat-box">
                        <div className="stat-number">{percentage}%</div>
                        <div className="stat-label">Precisión</div>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>

              <div className="results-message">
                {percentage >= 80 ? (
                  <p>¡Excelente trabajo! Sigues mejorando.</p>
                ) : percentage >= 60 ? (
                  <p>Buen trabajo. Sigue practicando.</p>
                ) : (
                  <p>No te rindas. La práctica hace al maestro.</p>
                )}
              </div>

              <div className="results-actions">
                <IonButton 
                  expand="block" 
                  className="action-button"
                  onClick={handleRestart}
                  fill="solid"
                >
                  <IonIcon icon={refresh} slot="start" />
                  Reintentar práctica
                </IonButton>
                
                <IonButton 
                  expand="block" 
                  className="action-button"
                  onClick={handleBackToLearn}
                  fill="outline"
                >
                  <IonIcon icon={home} slot="start" />
                  Volver a Aprender
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PracticeResultsScreen;