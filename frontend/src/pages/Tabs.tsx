// src/pages/Tabs.tsx
import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { home, statsChart, gameController, book, person } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';
import PracticeOverviewScreen from './tabs/PracticeOverviewScreen';
import ProgressScreen from './tabs/ProgressScreen';
import GamesScreen from './tabs/GamesScreen';
import DictionaryScreen from './tabs/DictionaryScreen';
import ProfileScreen from './tabs/ProfileScreen';
import './Tabs.css';

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/practice">
          <PracticeOverviewScreen />
        </Route>
        <Route exact path="/tabs/progress">
          <ProgressScreen />
        </Route>
        <Route exact path="/tabs/games">
          <GamesScreen />
        </Route>
        <Route exact path="/tabs/dictionary">
          <DictionaryScreen />
        </Route>
        <Route exact path="/tabs/profile">
          <ProfileScreen />
        </Route>
        <Route exact path="/tabs">
          <Redirect to="/tabs/practice" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="tab-bar">
        <IonTabButton tab="practice" href="/tabs/practice">
          <IonIcon icon={home} />
          <IonLabel>Práctica</IonLabel>
        </IonTabButton>

        <IonTabButton tab="progress" href="/tabs/progress">
          <IonIcon icon={statsChart} />
          <IonLabel>Progreso</IonLabel>
        </IonTabButton>

        <IonTabButton tab="games" href="/tabs/games">
          <IonIcon icon={gameController} />
          <IonLabel>Juegos</IonLabel>
        </IonTabButton>

        <IonTabButton tab="dictionary" href="/tabs/dictionary">
          <IonIcon icon={book} />
          <IonLabel>Diccionario</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/tabs/profile">
          <IonIcon icon={person} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;