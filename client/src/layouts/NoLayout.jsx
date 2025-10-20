import { Outlet } from 'react-router-dom';

export default function NoLayout() {
  return (
    <div data-theme="light" className="min-h-screen bg-base-100 text-base-content">
      <Outlet />
    </div>
  );
}
