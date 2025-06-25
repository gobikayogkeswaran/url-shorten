import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [view, setView] = useState(userId ? 'dashboard' : 'login');

  function handleLogin(id) {
    setUserId(id);
    localStorage.setItem('userId', id);
    setView('dashboard');
  }

  function handleLogout() {
    setUserId(null);
    localStorage.removeItem('userId');
    setView('login');
  }

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      {view === 'login' && <Login onLogin={handleLogin} onSwitch={() => setView('signup')} />}
      {view === 'signup' && <Signup onSignup={handleLogin} onSwitch={() => setView('login')} />}
      {view === 'dashboard' && <Dashboard userId={userId} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
