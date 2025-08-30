import React, { useState, useRef } from 'react';
import { api } from '../lib/api.js';
import MessageBubble from './MessageBubble.jsx';

export default function ChatWindow({ token, history, setHistory }) {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  async function send() {
    if (!input.trim() || busy) return;
    const userMsg = { role: 'user', content: input.trim() };
    setHistory([...history, { _id: crypto.randomUUID(), role: 'user', content: userMsg.content, createdAt: new Date().toISOString() }]);
    setInput('');
    setBusy(true);
    try {
      const res = await api(token).post('/chat', { messages: [userMsg] });
      setHistory((h) => [...h, res.message]);
    } catch (err) {
      setHistory((h) => [...h, { _id: crypto.randomUUID(), role: 'assistant', content: `Error: ${err.message}`, createdAt: new Date().toISOString() }]);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // Voice input handler
  function toggleMic() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      const recog = new SpeechRecognition();
      recog.lang = 'en-US';
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput((prev) => (prev ? prev + ' ' : '') + transcript);
      };
      recog.onstart = () => setListening(true);
      recog.onend = () => setListening(false);
      recog.onerror = () => setListening(false);
      recognitionRef.current = recog;
    }
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  }

  return (
    <main className="chat">
      <div className="messages">
        {history.map((m) => (
          <MessageBubble key={m._id} role={m.role} content={m.content} />
        ))}
      </div>
      <div className="composer">
        <button
          type="button"
          className={`mic-btn${listening ? ' listening' : ''}`}
          title={listening ? 'Stop listening' : 'Voice input'}
          onClick={toggleMic}
          style={{ background: listening ? '#22d3ee' : undefined }}
        >
          {listening ? '🎤...' : '🎤'}
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={busy ? 'Thinking…' : 'Type your message and press Enter'}
          disabled={busy}
        />
        <button onClick={send} disabled={busy || !input.trim()}>Send</button>
      </div>
    </main>
  );
}
