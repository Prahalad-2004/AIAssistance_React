import React, { useState } from 'react';
import { api } from '../lib/api.js';

export default function Register({ onRegister, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api().post('/auth/register', { email, password });
      onRegister(res.token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      <label>Password</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      <button type="submit">Create account</button>
      <p className="muted">Have an account? <a onClick={switchToLogin}>Login</a></p>
    </form>
  );
}
