import { useState } from 'react'
import { upsertFile } from '../lib/github'

export default function Admin() {
  const [owner, setOwner] = useState('')
  const [repo, setRepo] = useState('christon')
  const [branch, setBranch] = useState('gh-pages')
  const [token, setToken] = useState('')
  const [json, setJson] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function handleUpload() {
    try {
      setStatus('Uploading…')
      const parsed = JSON.stringify(JSON.parse(json))
      const contentBase64 = btoa(unescape(encodeURIComponent(parsed)))
      await upsertFile({
        repo: { owner, repo, branch },
        path: (branch === 'gh-pages' ? 'catalog.json' : 'public/catalog.json'),
        contentBase64,
        message: 'Update catalog via Admin UI',
        token,
      })
      setStatus('Uploaded! Refresh the site to see changes')
    } catch (e: any) {
      setStatus('Error: ' + e.message)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="text-white/70 text-sm">Paste a GitHub token with repo scope to update `public/catalog.json` directly.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input placeholder="owner" className="bg-white/5 rounded px-3 py-2" value={owner} onChange={e=>setOwner(e.target.value)} />
        <input placeholder="repo" className="bg-white/5 rounded px-3 py-2" value={repo} onChange={e=>setRepo(e.target.value)} />
        <input placeholder="branch" className="bg-white/5 rounded px-3 py-2" value={branch} onChange={e=>setBranch(e.target.value)} />
      </div>
      <input placeholder="github token" className="bg-white/5 rounded px-3 py-2 w-full" value={token} onChange={e=>setToken(e.target.value)} />

      <textarea placeholder="catalog.json contents" className="bg-white/5 rounded px-3 py-2 w-full h-64 font-mono text-sm" value={json} onChange={e=>setJson(e.target.value)} />

      <div className="flex gap-3 items-center">
        <button className="px-4 py-2 rounded bg-brand text-black" onClick={handleUpload}>Upload</button>
        {status && <div className="text-white/70 text-sm">{status}</div>}
      </div>
    </div>
  )
}