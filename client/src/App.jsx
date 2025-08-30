import React, { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import Sidebar from './components/Sidebar.jsx';
import { api } from './lib/api.js';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState(token ? 'chat' : 'login');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!token) return;
    api(token).get('/chat/history').then((res) => setHistory(res.messages)).catch(() => {});
  }, [token]);

  function handleLogin(t) {
    localStorage.setItem('token', t);
    setToken(t);
    setView('chat');
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
  }

  return (
    <div className="app">
      {!token && view === 'login' && (
        <div className="auth-card">
          <Login onLogin={handleLogin} switchToRegister={() => setView('register')} />
        </div>
      )}
      {!token && view === 'register' && (
        <div className="auth-card">
          <Register onRegister={handleLogin} switchToLogin={() => setView('login')} />
        </div>
      )}
      {token && (
        <div className="layout">
          <Sidebar history={history} onClear={async () => {
            await api(token).delete('/chat/history');
            setHistory([]);
          }} onLogout={logout} />
          <ChatWindow token={token} history={history} setHistory={setHistory} />
        </div>
      )}
    </div>
  );
}
