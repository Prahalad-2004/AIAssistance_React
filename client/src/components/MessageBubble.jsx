import React from 'react';

export default function MessageBubble({ role, content }) {
  function speak() {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }
    const utter = new window.SpeechSynthesisUtterance(content);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  }

  return (
    <div className={`msg ${role}`}>
      <div className="avatar">{role === 'assistant' ? '🤖' : '🧑'}</div>
      <div className="bubble">
        <pre>{content}</pre>
        {role === 'assistant' && (
          <button className="speak-btn" title="Read aloud" onClick={speak} style={{marginTop:4}}>🔊</button>
        )}
      </div>
    </div>
  );
}
