import { createContext, useContext, useState } from 'react';
import { authToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(authToken.get());

  const login = (token) => {
    authToken.set(token);
    setToken(token);
  };

  const logout = () => {
    authToken.clear();
    setToken('');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
