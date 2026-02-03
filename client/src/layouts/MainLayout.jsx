import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

export default function MainLayout() {
  const { theme } = useTheme();

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
