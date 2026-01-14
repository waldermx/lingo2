// src/pages/tabs/SettingsScreen.tsx - REEMPLAZA SettingsTab.tsx
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

const SettingsScreen: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ajustes</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div className="tab-container">
          <IonCard className="placeholder-card">
            <IonCardContent>
              <div className="placeholder-content">
                <div className="placeholder-icon">⚙️</div>
                <h3>Opciones de la app</h3>
                <p>Aquí irán distintas configuraciones.</p>
                <small>Próximamente</small>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SettingsScreen;