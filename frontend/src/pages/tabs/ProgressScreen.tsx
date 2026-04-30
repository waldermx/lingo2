// src/pages/tabs/ProgressScreen.tsx - REEMPLAZA ProgressTab.tsx
import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonCard, 
  IonCardContent 
} from '@ionic/react';

import { useHistory } from 'react-router-dom';
import './TabStyles.css';

const ProgressScreen: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Progreso</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div className="tab-container">
          <IonCard className="placeholder-card">
            <IonCardContent>
              <div className="placeholder-content">
                <div className="placeholder-icon">📊</div>
                <h3>Resumen del progreso</h3>
                <p>Tus estadísticas de aprendizaje aparecerán aquí.</p>
                <small>Próximamente</small>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProgressScreen;