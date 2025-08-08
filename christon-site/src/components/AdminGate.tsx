import { useEffect, useState } from 'react';
import { auth, adminLogin, adminLogout } from '../lib/firebase';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

export function AdminGate() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await adminLogin(email, password);
      setOpen(false);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-2">
          <a href="#/admin" className="btn btn-primary">Admin</a>
          <button className="btn" onClick={() => adminLogout()}>Logout</button>
        </div>
      ) : (
        <button className="btn" onClick={() => setOpen(true)}>Login</button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={handleLogin} className="card p-6 w-full max-w-sm">
            <div className="heading text-lg mb-2">Admin Login</div>
            {error && <div className="text-sm text-red-400 mb-2">{error}</div>}
            <input className="w-full mb-2 px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full mb-4 px-3 py-2 rounded bg-zinc-950 border border-zinc-800" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex items-center justify-end gap-2">
              <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}