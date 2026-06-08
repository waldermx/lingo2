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
import LoginScreen from './pages/auth/LoginScreen';
import RegisterScreen from './pages/auth/RegisterScreen';
import OnboardingScreen from './pages/OnboardingScreen';
import { useUserStore } from './stores/userStore';

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

const AppRoutes: React.FC = () => {
  const { token } = useUserStore();

  return (
    <IonRouterOutlet>
      {/* Auth */}
      <Route exact path="/auth/login" component={LoginScreen} />
      <Route exact path="/auth/register" component={RegisterScreen} />

      {/* Onboarding — requires auth */}
      <Route exact path="/onboarding">
        {token ? <OnboardingScreen /> : <Redirect to="/auth/login" />}
      </Route>

      {/* Main tabs — guests allowed (GuestRegisterModal handles the limit) */}
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

      {/* Default — send to login if no token, tabs if authenticated */}
      <Route exact path="/">
        {token ? <Redirect to="/tabs/practice" /> : <Redirect to="/auth/login" />}
      </Route>
    </IonRouterOutlet>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <IonReactRouter>
        <AppRoutes />
      </IonReactRouter>
    </IonApp>
  </QueryClientProvider>
);

export default App;
