import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { logout } = useAuth();
  const { theme, changeTheme, THEMES } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileThemeOpen, setMobileThemeOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/users', label: 'Users' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setMobileThemeOpen(false);
  };

  return (
    <div className="navbar bg-base-200 px-4 shadow">
      <div className="flex-none lg:hidden">
        <button
          className="btn btn-ghost btn-circle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div className="flex-1">
        <Link to="/" className="text-xl font-bold" onClick={handleNavClick}>
          MVC App
        </Link>
      </div>

      <div className="flex-none">
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

      <div className="hidden lg:flex lg:flex-none lg:gap-2">
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className="btn btn-ghost">
            {item.label}
          </Link>
        ))}

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              {theme === THEMES.DARK ? (
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              ) : theme === THEMES.LIGHT ? (
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-32"
          >
            <li>
              <button
                onClick={() => changeTheme(THEMES.LIGHT)}
                className={theme === THEMES.LIGHT ? 'active' : ''}
              >
                Claro
              </button>
            </li>
            <li>
              <button
                onClick={() => changeTheme(THEMES.DARK)}
                className={theme === THEMES.DARK ? 'active' : ''}
              >
                Oscuro
              </button>
            </li>
            <li>
              <button
                onClick={() => changeTheme(THEMES.AUTO)}
                className={theme === THEMES.AUTO ? 'active' : ''}
              >
                Auto
              </button>
            </li>
          </ul>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={handleNavClick}
          />

          <div className="absolute left-0 top-0 h-screen w-72 bg-base-200 shadow-xl">
            <div className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="btn btn-ghost justify-start"
                  onClick={handleNavClick}
                >
                  {item.label}
                </Link>
              ))}

              <div className="divider my-2" />

              <button
                className="btn btn-ghost justify-start"
                onClick={() => setMobileThemeOpen((v) => !v)}
              >
                Tema: {theme === THEMES.LIGHT ? 'Claro' : theme === THEMES.DARK ? 'Oscuro' : 'Auto'}
              </button>

              {mobileThemeOpen && (
                <div className="join join-vertical w-full">
                  <button
                    className={`btn join-item justify-start ${theme === THEMES.LIGHT ? 'btn-active' : ''}`}
                    onClick={() => {
                      changeTheme(THEMES.LIGHT);
                      handleNavClick();
                    }}
                  >
                    Claro
                  </button>
                  <button
                    className={`btn join-item justify-start ${theme === THEMES.DARK ? 'btn-active' : ''}`}
                    onClick={() => {
                      changeTheme(THEMES.DARK);
                      handleNavClick();
                    }}
                  >
                    Oscuro
                  </button>
                  <button
                    className={`btn join-item justify-start ${theme === THEMES.AUTO ? 'btn-active' : ''}`}
                    onClick={() => {
                      changeTheme(THEMES.AUTO);
                      handleNavClick();
                    }}
                  >
                    Automático
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
