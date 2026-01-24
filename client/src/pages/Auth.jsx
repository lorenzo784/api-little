import { useState } from 'react';
import { api, authToken } from '../lib/api.js';
import Input from '../components/Input';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const data = await api.auth.login({ email, password });
      authToken.set(data.token);
      setToken(data.token);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center">Inicio de sesión</h2>

          <div className="space-y-4 mt-4">
            <Input
              label="Email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn btn-primary w-full" onClick={login} disabled={loading}>
              Iniciar sesión
            </button>

            <p className="text-center mt-2">
              ¿No tienes cuenta?{' '}
              <a href="#" className="link link-primary">
                Registrarse
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
