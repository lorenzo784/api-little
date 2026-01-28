import { createContext, useContext, useState, useEffect } from 'react';
import { access, setSessionExpiredHandler } from '../lib/api';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(access.get());

  const login = (accessToken) => {
    access.set(accessToken);
    setAccessToken(accessToken);
  };

  const logout = () => {
    access.clear();
    setAccessToken('');
  };

  const isAuthenticated = !!accessToken;


  useEffect(() => {
    setSessionExpiredHandler(logout);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
