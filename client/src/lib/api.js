const API_BASE = '';

const tokenKey = 'auth_token';

export const authToken = {
  get() {
    try {
      return localStorage.getItem(tokenKey) || '';
    } catch {
      return '';
    }
  },
  set(token) {
    try {
      localStorage.setItem(tokenKey, token);
    } catch {}
  },
  clear() {
    try {
      localStorage.removeItem(tokenKey);
    } catch {}
  },
};

async function request(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const h = { 'Content-Type': 'application/json', ...headers };

  if (auth) {
    const token = authToken.get();
    if (token) h.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const error = new Error(typeof data === 'string' ? data : data?.message || 'Request failed');
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    signup: (payload) =>
      request('/api/auth/signup', {
        method: 'POST',
        body: payload,
        auth: false,
      }),
    login: (payload) =>
      request('/api/auth/login', {
        method: 'POST',
        body: payload,
        auth: false,
      }),
  },
  users: {
    list: () => request('/api/users'),
    getById: (id) => request(`/api/users/${id}`),
    create: (payload) => request('/api/users', { method: 'POST', body: payload }),
    remove: (id) => request(`/api/users/${id}`, { method: 'DELETE' }),
  },
  health: () => request('/health', { auth: false }),
};
