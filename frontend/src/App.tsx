import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FlashcardScreen from './pages/FlashcardScreen';
import PracticeQuizScreen from './pages/PracticeQuizScreen';
import PracticeResultsScreen from './pages/PracticeResultsScreen';
import TimeAttackScreen from './pages/games/TimeAttackScreen';
import BombModeScreen from './pages/games/BombModeScreen';
import Tabs from './pages/Tabs';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Main tabs */}
          <Route path="/tabs" component={Tabs} />

          {/* Flashcard / Learn */}
          <Route exact path="/learn">
            <FlashcardScreen />
          </Route>

          {/* Quiz (HanziWriter) */}
          <Route exact path="/quiz">
            <PracticeQuizScreen />
          </Route>

          {/* Results */}
          <Route exact path="/practice-results">
            <PracticeResultsScreen />
          </Route>
          <Route exact path="/congratulations">
            <PracticeResultsScreen />
          </Route>

          {/* Games */}
          <Route exact path="/games/time-attack">
            <TimeAttackScreen />
          </Route>
          <Route exact path="/games/bomb-mode">
            <BombModeScreen />
          </Route>

          {/* Default */}
          <Route exact path="/">
            <Redirect to="/tabs/practice" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </QueryClientProvider>
);


export default App;