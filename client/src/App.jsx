import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import Auth from './pages/Auth.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import NoLayout from './layouts/NoLayout.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
      </Route>
      <Route element={<NoLayout />}>
        <Route path="/auth" element={<Auth />} />
      </Route>
    </Routes>
  );
}
