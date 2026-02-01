const API_BASE = import.meta.env.VITE_API_BASE || ''

const accessToken = 'access_token';
const refreshToken = 'refresh_token';

let onSessionExpired = null;

export const setSessionExpiredHandler = (fn) => {
  onSessionExpired = fn;
};

export const access = {
  get() {
    try {
      return localStorage.getItem(accessToken) || '';
    } catch {
      return '';
    }
  },
  set(token) {
    try {
      localStorage.setItem(accessToken, token);
    } catch {}
  },
  clear() {
    try {
      localStorage.removeItem(accessToken);
    } catch {}
  },
};

export const refresh = {
  get() {
    try {
      return localStorage.getItem(refreshToken) || '';
    } catch {
      return '';
    }
  },
  set(token) {
    try {
      localStorage.setItem(refreshToken, token);
    } catch {}
  },
  clear() {
    try {
      localStorage.removeItem(refreshToken);
    } catch {}
  },
};

async function request(path, options = {}) {
  const { method = 'GET', body, headers = {}, auth = true } = options;
  const h = { 'Content-Type': 'application/json', ...headers };

  if (auth) {
    const token = access.get();
    if (token) h.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    access.clear();
    onSessionExpired?.();
    throw new Error('SESSION_EXPIRED');
  }

  // Refresh token not saved

  // if (res.status === 401 && auth) {
  //   const refreshToken = localStorage.getItem('refresh_token');
  //   if (refreshToken) {
  //     const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ token: refreshToken }),
  //     });
  //     if (refreshRes.ok) {
  //       const { accessToken } = await refreshRes.json();
  //       authToken.set(accessToken);
  //       return request(path, options);
  //     } else {
  //       authToken.clear();
  //       localStorage.removeItem('refresh_token');
  //       throw new Error('Sesion expirada, por favor logueate de nuevo');
  //     }
  //   }
  // }

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
    update: (id, payload) => request(`/api/users/${id}`, { method: 'PUT', body: payload }),
  },
  health: () => request('/health', { auth: false }),
  roles: {
    list: () => request('/api/roles'),
  },
};
