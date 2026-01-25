import { useState } from 'react';
import { api } from '../lib/api.js';
import Input from '../components/Input';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const login = async () => {
    try {
      setLoading(true);
      setErrors({});

      const data = await api.auth.login({ email, password });

      authLogin(data.accessToken);

      showToast('Login exitoso', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      const issues = err?.data?.issues;

      if (issues) {
        const fieldErrors = {};
        issues.forEach((i) => {
          const field = i.path[0];
          fieldErrors[field] = i.message;
        });

        setErrors(fieldErrors);
        return;
      }
      showToast(err?.message || 'Error al iniciar sesión', 'error');
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
              error={errors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              error={errors.password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />

            <button className="btn btn-primary w-full" onClick={login} disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
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
