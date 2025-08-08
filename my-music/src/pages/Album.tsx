import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Album as AlbumType } from '../lib/catalog'
import { loadCatalog } from '../lib/catalog'

export default function Album() {
  const { albumId } = useParams()
  const [album, setAlbum] = useState<AlbumType | null>(null)

  useEffect(() => {
    loadCatalog().then((c) => setAlbum(c.albums.find(a => a.id === albumId) ?? null))
  }, [albumId])

  if (!album) return <div>Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex gap-6 items-end">
        <div className="w-40 h-40 bg-neutral-800 rounded overflow-hidden">
          {album.coverUrl && <img className="w-full h-full object-cover" src={album.coverUrl} alt={album.title} />}
        </div>
        <div>
          <div className="text-xs uppercase text-white/60">Album</div>
          <h1 className="text-4xl font-extrabold leading-tight">{album.title}</h1>
          <div className="text-white/70 text-sm">{album.artist}{album.year ? ` • ${album.year}` : ''}</div>
        </div>
      </div>
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-white/60">
            <tr className="text-left">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Plays</th>
              <th className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {album.tracks.map((t, i) => (
              <tr key={t.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-2 text-white/60">{i + 1}</td>
                <td className="px-4 py-2">{t.title}</td>
                <td className="px-4 py-2 text-white/70">{(t.plays ?? 0).toLocaleString()} 😂</td>
                <td className="px-4 py-2 text-white/60">{Math.floor(t.durationSec/60)}:{String(t.durationSec%60).padStart(2, '0')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}