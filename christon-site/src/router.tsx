import { useEffect, useMemo, useState } from 'react';
import App from './App';
import { AdminDashboard } from './pages/AdminDashboard';

export function Router() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const onHash = () => setHash(location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const element = useMemo(() => {
    if (hash.startsWith('#/admin')) return <AdminDashboard/>;
    return <App/>;
  }, [hash]);

  return element;
}