import React from 'react';

export default function Sidebar({ history, onClear, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>History</h3>
        <button className="link" onClick={onClear}>Clear</button>
      </div>
      <div className="history">
        {history.length === 0 && <div className="muted">No messages yet.</div>}
        {history.map((m) => (
          <div key={m._id} className="history-item">
            <span className={`tag tag-${m.role}`}>{m.role}</span>
            <p title={new Date(m.createdAt).toLocaleString()}>{m.content.slice(0, 60)}</p>
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <button onClick={onLogout}>Log out</button>
      </div>
    </aside>
  );
}
