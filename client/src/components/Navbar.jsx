import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="navbar bg-base-200 px-4 shadow">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold">
          MVC App
        </Link>
      </div>

      <div className="flex-none gap-2">
        <Link to="/" className="btn btn-ghost">
          Home
        </Link>
        <Link to="/users" className="btn btn-ghost">
          Users
        </Link>

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <FaUserCircle size={28} />
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li>
              <button onClick={handleLogout} className="text-error">
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
