import useSWR from 'swr';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

async function fetchMerch() {
  const q = query(collection(db, 'merch'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export function Merch() {
  const { data, isLoading } = useSWR('merch', fetchMerch, { suspense: false });

  return (
    <div className="card p-6">
      <h2 className="heading text-2xl mb-4">Merch</h2>
      {isLoading && <div className="subtle">Loading…</div>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(data || []).map((m: any) => (
          <a key={m.id} href={m.link || '#'} target="_blank" rel="noreferrer" className="group rounded border border-zinc-800 bg-zinc-900/40 overflow-hidden">
            {m.imageUrl && (
              <img className="aspect-square object-cover w-full group-hover:scale-[1.03] transition-transform" src={m.imageUrl} alt={m.title} />
            )}
            <div className="p-3">
              <div className="text-white font-medium truncate">{m.title || 'Item'}</div>
              {m.price && <div className="text-sm subtle">${m.price}</div>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}