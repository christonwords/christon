import useSWR from 'swr';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

async function fetchNews() {
  const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(10));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export function NewsTicker() {
  const { data } = useSWR('news', fetchNews, { suspense: false });
  if (!data || data.length === 0) return null;
  return (
    <div className="text-xs subtle overflow-hidden whitespace-nowrap">
      <div className="animate-[marquee_24s_linear_infinite] inline-block" style={{ paddingLeft: '100%' }}>
        {data.map((n: any) => (
          <span key={n.id} className="mx-6">{n.title}</span>
        ))}
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}`}</style>
    </div>
  );
}