import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function MainLayout() {
  return (
    <div data-theme="light" className="min-h-screen bg-base-100 text-base-content">
      <Navbar />
      <Outlet />
    </div>
  );
}
