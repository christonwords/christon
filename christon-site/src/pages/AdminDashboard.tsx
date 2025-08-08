import { useEffect, useState } from 'react';
import { auth, db, uploadFileAndGetUrl, firebaseReady } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';

export function AdminDashboard() {
  if (!firebaseReady) {
    return <div className="card p-6"><div className="heading text-lg">Admin</div><div className="subtle text-sm">Firebase is not configured. Set VITE_FIREBASE_* envs in repo Secrets.</div></div>;
  }

  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState<'news' | 'unreleased' | 'merch' | 'production'>('news');

  useEffect(() => onAuthStateChanged(auth!, (u) => setAuthorized(!!u)), []);

  if (!authorized) {
    return <div className="card p-6"><div className="heading text-lg">Admin</div><div className="subtle">Please login from the header.</div></div>;
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        {(['news','unreleased','merch','production'] as const).map((t) => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === 'news' && <NewsSection />}
      {tab === 'unreleased' && <UnreleasedSection />}
      {tab === 'merch' && <MerchSection />}
      {tab === 'production' && <ProductionSection />}
    </div>
  );
}

function NewsSection() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  async function refresh() {
    const qref = query(collection(db!, 'news'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(qref);
    setItems(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  }
  useEffect(() => { refresh(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      await addDoc(collection(db!, 'news'), { title, body, createdAt: new Date().toISOString() });
      setTitle(''); setBody('');
      await refresh();
    } catch (e: any) {
      setError(e.message || 'Failed to post');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    await deleteDoc(doc(db!, 'news', id));
    await refresh();
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-2">
        {error && <div className="text-sm text-red-400">{error}</div>}
        <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
        <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Posting…' : 'Post News'}</button>
      </form>
      <div className="mt-4 space-y-2">
        {items.map((n) => (
          <div key={n.id} className="p-3 rounded border border-zinc-800 bg-zinc-900/40 flex items-start justify-between">
            <div>
              <div className="text-white font-medium">{n.title}</div>
              <div className="text-xs subtle max-w-xl whitespace-pre-wrap">{n.body}</div>
            </div>
            <button className="btn" onClick={() => onDelete(n.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function UnreleasedSection() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  async function refresh() {
    const qref = query(collection(db!, 'unreleased'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(qref);
    setItems(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  }
  useEffect(() => { refresh(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      let audioUrl = '';
      if (file) audioUrl = await uploadFileAndGetUrl(file, 'unreleased');
      await addDoc(collection(db!, 'unreleased'), { title, notes, audioUrl, createdAt: new Date().toISOString() });
      setTitle(''); setNotes(''); setFile(null);
      await refresh();
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    await deleteDoc(doc(db!, 'unreleased', id));
    await refresh();
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-2">
        {error && <div className="text-sm text-red-400">{error}</div>}
        <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Uploading…' : 'Upload Track'}</button>
      </form>
      <div className="mt-4 space-y-2">
        {items.map((t) => (
          <div key={t.id} className="p-3 rounded border border-zinc-800 bg-zinc-900/40">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{t.title || 'Untitled'}</div>
                {t.notes && <div className="text-xs subtle">{t.notes}</div>}
              </div>
              <button className="btn" onClick={() => onDelete(t.id)}>Delete</button>
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

function MerchSection() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  async function refresh() {
    const qref = query(collection(db!, 'merch'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(qref);
    setItems(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  }
  useEffect(() => { refresh(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      let imageUrl = '';
      if (image) imageUrl = await uploadFileAndGetUrl(image, 'merch');
      await addDoc(collection(db!, 'merch'), { title, price, link, imageUrl, createdAt: new Date().toISOString() });
      setTitle(''); setPrice(''); setLink(''); setImage(null);
      await refresh();
    } catch (e: any) {
      setError(e.message || 'Failed to add item');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    await deleteDoc(doc(db!, 'merch', id));
    await refresh();
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-2">
        {error && <div className="text-sm text-red-400">{error}</div>}
        <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Add Item'}</button>
      </form>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((m) => (
          <div key={m.id} className="p-3 rounded border border-zinc-800 bg-zinc-900/40">
            <div className="flex items-center justify-between">
              <div className="text-white font-medium">{m.title || 'Item'}</div>
              <button className="btn" onClick={() => onDelete(m.id)}>Delete</button>
            </div>
            {m.imageUrl && <img className="mt-2 rounded" src={m.imageUrl} alt={m.title} />}
            {m.price && <div className="text-sm subtle mt-1">${m.price}</div>}
            {m.link && <a href={m.link} target="_blank" rel="noreferrer" className="btn mt-2">Open Link</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductionSection() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  async function refresh() {
    const qref = query(collection(db!, 'production'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(qref);
    setItems(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  }
  useEffect(() => { refresh(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      let imageUrl = '';
      let audioUrl = '';
      if (image) imageUrl = await uploadFileAndGetUrl(image, 'production');
      if (audio) audioUrl = await uploadFileAndGetUrl(audio, 'production');
      await addDoc(collection(db!, 'production'), { title, imageUrl, audioUrl, createdAt: new Date().toISOString() });
      setTitle(''); setImage(null); setAudio(null);
      await refresh();
    } catch (e: any) {
      setError(e.message || 'Failed to add');
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    await deleteDoc(doc(db!, 'production', id));
    await refresh();
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-2">
        {error && <div className="text-sm text-red-400">{error}</div>}
        <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label className="subtle text-sm">Cover Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <label className="subtle text-sm">Audio</label>
        <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] || null)} />
        <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Uploading…' : 'Add Beat'}</button>
      </form>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((b) => (
          <div key={b.id} className="p-3 rounded border border-zinc-800 bg-zinc-900/40">
            <div className="flex items-center justify-between">
              <div className="text-white font-medium">{b.title || 'Untitled Beat'}</div>
              <button className="btn" onClick={() => onDelete(b.id)}>Delete</button>
            </div>
            {b.imageUrl && <img className="mt-2 rounded" src={b.imageUrl} alt={b.title} />}
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