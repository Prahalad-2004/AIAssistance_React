const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function request(token, path, options = {}) {
  return fetch(`${BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || 'Request failed');
    return data;
  });
}

export function api(token) {
  return {
    get: (path) => request(token, path, { method: 'GET' }),
    post: (path, body) => request(token, path, { method: 'POST', body: JSON.stringify(body) }),
    delete: (path) => request(token, path, { method: 'DELETE' })
  };
}
