import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function NoLayout() {
  const { theme } = useTheme();

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100 text-base-content">
      <Outlet />
    </div>
  );
}
