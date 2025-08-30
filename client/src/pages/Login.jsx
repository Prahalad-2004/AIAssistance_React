import React, { useState } from 'react';
import { api } from '../lib/api.js';

export default function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api().post('/auth/login', { email, password });
      onLogin(res.token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      <label>Password</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      <button type="submit">Sign in</button>
      <p className="muted">No account? <a onClick={switchToRegister}>Register</a></p>
    </form>
  );
}
