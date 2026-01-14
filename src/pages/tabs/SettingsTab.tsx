// src/pages/tabs/SettingsTab.tsx
import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent } from '@ionic/react';
import './TabStyles.css';

const SettingsTab: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="tab-header">
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="tab-content">
        <div className="tab-container">
          <IonCard className="placeholder-card">
            <IonCardContent>
              <div className="placeholder-content">
                <div className="placeholder-icon">⚙️</div>
                <h3>App Settings</h3>
                <p>Configuration options will appear here.</p>
                <small>Features coming soon</small>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SettingsTab;