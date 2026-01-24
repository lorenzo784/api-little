import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
