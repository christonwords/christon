import { useEffect, useState } from 'react';
import { auth, db, uploadFileAndGetUrl } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

export function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState<'news' | 'unreleased' | 'merch' | 'production'>('news');

  useEffect(() => onAuthStateChanged(auth, (u) => setAuthorized(!!u)), []);

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
      {tab === 'news' && <NewsForm />}
      {tab === 'unreleased' && <UnreleasedForm />}
      {tab === 'merch' && <MerchForm />}
      {tab === 'production' && <ProductionForm />}
    </div>
  );
}

function NewsForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await addDoc(collection(db, 'news'), { title, body, createdAt: new Date().toISOString() });
    setTitle(''); setBody(''); setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
      <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Posting…' : 'Post News'}</button>
    </form>
  );
}

function UnreleasedForm() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    let audioUrl = '';
    if (file) audioUrl = await uploadFileAndGetUrl(file, 'unreleased');
    await addDoc(collection(db, 'unreleased'), { title, notes, audioUrl, createdAt: new Date().toISOString() });
    setTitle(''); setNotes(''); setFile(null); setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
      <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Uploading…' : 'Upload Track'}</button>
    </form>
  );
}

function MerchForm() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    let imageUrl = '';
    if (image) imageUrl = await uploadFileAndGetUrl(image, 'merch');
    await addDoc(collection(db, 'merch'), { title, price, link, imageUrl, createdAt: new Date().toISOString() });
    setTitle(''); setPrice(''); setLink(''); setImage(null); setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Add Item'}</button>
    </form>
  );
}

function ProductionForm() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    let imageUrl = '';
    let audioUrl = '';
    if (image) imageUrl = await uploadFileAndGetUrl(image, 'production');
    if (audio) audioUrl = await uploadFileAndGetUrl(audio, 'production');
    await addDoc(collection(db, 'production'), { title, imageUrl, audioUrl, createdAt: new Date().toISOString() });
    setTitle(''); setImage(null); setAudio(null); setSubmitting(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <input className="w-full px-3 py-2 rounded bg-zinc-950 border border-zinc-800" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="subtle text-sm">Cover Image</label>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <label className="subtle text-sm">Audio</label>
      <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] || null)} />
      <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Uploading…' : 'Add Beat'}</button>
    </form>
  );
}