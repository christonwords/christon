import useSWR from 'swr';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

async function fetchBeats() {
  const q = query(collection(db, 'production'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export function Production() {
  const { data, isLoading } = useSWR('production', fetchBeats, { suspense: false });

  return (
    <div className="card p-6">
      <h2 className="heading text-2xl mb-4">Production Suite</h2>
      {isLoading && <div className="subtle">Loading…</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(data || []).map((b: any) => (
          <div key={b.id} className="p-3 rounded border border-zinc-800 bg-zinc-900/40">
            <div className="text-white font-medium">{b.title || 'Untitled Beat'}</div>
            {b.imageUrl && (
              <img className="mt-2 rounded" src={b.imageUrl} alt={b.title} />
            )}
            {b.audioUrl && (
              <audio controls className="mt-2 w-full">
                <source src={b.audioUrl} />
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}