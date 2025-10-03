import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import LandingPage from './LandingPage/index.tsx'
import Login from './components/Login.tsx'
import Signup from './components/Signup.tsx'
import Dashboard from './Dashboard/Dashboard.tsx'
import './index.css'

type View = 'landing' | 'login' | 'signup' | 'dashboard';

function RootApp() {
  const [view, setView] = useState<View>('landing');

  if (view === 'login') {
    return <Login onBack={() => setView('landing')} onSignupClick={() => setView('signup')} onSuccess={() => setView('dashboard')} />
  }
  if (view === 'signup') {
    return <Signup onBack={() => setView('landing')} onLoginClick={() => setView('login')} />
  }
  if (view === 'dashboard') {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
    if (!token) {
      setView('login');
      return null;
    }
    return <Dashboard />
  }
  return (
    <LandingPage onLogin={() => setView('login')} onSignup={() => setView('signup')} onExplore={() => setView('dashboard')} />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
