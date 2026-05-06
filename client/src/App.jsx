import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import Auth from './pages/Auth';
import MainLayout from './layouts/MainLayout';
import NoLayout from './layouts/NoLayout';
// import RequireAuth from './components/RequireAuth';

import SimulationPage from './pages/SimulationPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<SimulationPage />} />
        <Route path="users" element={<Users />} />
        <Route path="home" element={<Home />} />
      </Route>

      <Route element={<NoLayout />}>
        <Route path="auth" element={<Auth />} />
      </Route>
    </Routes>
  );
}
