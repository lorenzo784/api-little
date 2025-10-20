import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1 px-2">MVC App</div>
      <div className="flex-none">
        <Link to="/" className="btn btn-ghost">
          Home
        </Link>
        <Link to="/users" className="btn btn-ghost">
          Users
        </Link>
        <Link to="/auth" className="btn btn-ghost">
          Auth
        </Link>
      </div>
    </div>
  );
}
