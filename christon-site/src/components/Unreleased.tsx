import useSWR from 'swr';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, firebaseReady } from '../lib/firebase';

async function fetchUnreleased() {
  if (!firebaseReady || !db) return [] as any[];
  const q = query(collection(db, 'unreleased'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export function Unreleased() {
  const { data, isLoading } = useSWR('unreleased', fetchUnreleased, { suspense: false });

  return (
    <div className="card p-6">
      <h2 className="heading text-2xl mb-4">Unreleased</h2>
      {!firebaseReady && <div className="subtle text-sm">Connect Firebase to manage unreleased tracks.</div>}
      {isLoading && <div className="subtle">Loading…</div>}
      <div className="space-y-4">
        {(data || []).map((t: any) => (
          <div key={t.id} className="p-3 rounded border border-zinc-800 bg-zinc-900/40">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{t.title || 'Untitled'}</div>
                {t.notes && <div className="text-xs subtle">{t.notes}</div>}
              </div>
              <div className="text-xs subtle">{new Date(t.createdAt).toLocaleDateString()}</div>
            </div>
            {t.audioUrl && (
              <audio controls className="mt-2 w-full">
                <source src={t.audioUrl} />
              </audio>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}