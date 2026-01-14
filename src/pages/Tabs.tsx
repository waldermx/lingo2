// src/pages/Tabs.tsx
import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { statsChart, book, settings } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';
import ProgressTab from './tabs/ProgressTab';
import PracticeTab from './tabs/PracticeTab';
import SettingsTab from './tabs/SettingsTab';
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
          <IonLabel>Progress</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="practice" href="/tabs/practice">
          <IonIcon icon={book} />
          <IonLabel>Practice</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon icon={settings} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;