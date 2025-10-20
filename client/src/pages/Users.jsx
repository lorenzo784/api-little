import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.users
      .list()
      .then(setUsers)
      .catch((e) => setError(e.message || 'No se pudo cargar usuarios'));
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Users</h2>
      {error && <div className="alert alert-error mt-3">{error}</div>}
      <ul className="mt-4 space-y-2">
        {users.map((u) => (
          <li key={u.id} className="card bg-base-200 p-4">
            {u.email} — {u.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
