// src/pages/tabs/ProgressTab.tsx
import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent } from '@ionic/react';
import './TabStyles.css';

const ProgressTab: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="tab-header">
        <IonToolbar>
          <IonTitle>Progress</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="tab-content">
        <div className="tab-container">
          <IonCard className="placeholder-card">
            <IonCardContent>
              <div className="placeholder-content">
                <div className="placeholder-icon">📊</div>
                <h3>Progress Overview</h3>
                <p>Your learning statistics will appear here.</p>
                <small>Features coming soon</small>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProgressTab;