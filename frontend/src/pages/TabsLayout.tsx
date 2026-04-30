// src/pages/TabsLayout.tsx - NUEVO ARCHIVO
import React from 'react';
import { IonTabs, IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import ProgressScreen from './tabs/ProgressScreen';
import PracticeOverviewScreen from './tabs/PracticeOverviewScreen';
import SettingsScreen from './tabs/SettingsScreen';

const TabsLayout: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/progress">
          <ProgressScreen />
        </Route>
        <Route exact path="/tabs/practice">
          <PracticeOverviewScreen />
        </Route>
        <Route exact path="/tabs/settings">
          <SettingsScreen />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/practice" />
        </Route>
      </IonRouterOutlet>


    </IonTabs>
  );
};

export default TabsLayout;