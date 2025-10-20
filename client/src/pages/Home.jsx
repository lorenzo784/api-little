import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function Home() {
  const [health, setHealth] = useState(null);
  useEffect(() => {
    api
      .health()
      .then(setHealth)
      .catch(() => setHealth({ ok: false }));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Express + Vite + React + DaisyUI</h1>
      <p className="mt-2">
        Health: <span className="badge badge-info">{String(health?.ok)}</span>
      </p>
    </div>
  );
}
