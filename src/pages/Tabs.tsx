// src/pages/Tabs.tsx
import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { statsChart, book, settings } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';
import ProgressTab from './tabs/ProgressScreen.tsx';
import PracticeTab from './tabs/PracticeOverviewScreen.js';
import SettingsTab from './tabs/SettingsScreen.js';
import './Tabs.css';

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/progress">
          <ProgressTab />
        </Route>
        <Route exact path="/tabs/practice">
          <PracticeTab />
        </Route>
        <Route exact path="/tabs/settings">
          <SettingsTab />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/practice" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="tab-bar">
        <IonTabButton tab="progress" href="/tabs/progress">
          <IonIcon icon={statsChart} />
          <IonLabel>Progreso</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="practice" href="/tabs/practice">
          <IonIcon icon={book} />
          <IonLabel>Práctica</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon icon={settings} />
          <IonLabel>Ajustes</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;