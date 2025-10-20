import { useState } from 'react';
import { api, authToken } from '../lib/api.js';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');

  const signup = async () => {
    const data = await api.auth.signup({ email, password, name });
    authToken.set(data.token);
    setToken(data.token);
  };
  const login = async () => {
    const data = await api.auth.login({ email, password });
    authToken.set(data.token);
    setToken(data.token);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Auth</h2>
      <input
        className="input input-bordered w-full"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="input input-bordered w-full"
        placeholder="name (signup)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="join">
        <button className="btn btn-primary join-item" onClick={signup}>
          Signup
        </button>
        <button className="btn btn-secondary join-item" onClick={login}>
          Login
        </button>
      </div>
      {token && (
        <div className="alert alert-success">
          <span>Token guardado en localStorage:</span> <code className="break-all">{token}</code>
        </div>
      )}
    </div>
  );
}
