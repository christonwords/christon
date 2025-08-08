import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Catalog, Track } from '../lib/catalog'
import { loadCatalog } from '../lib/catalog'

export default function Playlist() {
  const { playlistId } = useParams()
  const [catalog, setCatalog] = useState<Catalog | null>(null)

  useEffect(() => {
    loadCatalog().then(setCatalog)
  }, [playlistId])

  const playlist = useMemo(() => catalog?.playlists.find(p => p.id === playlistId) ?? null, [catalog, playlistId])
  const tracks: Track[] = useMemo(() => {
    if (!catalog || !playlist) return []
    const byId = new Map(catalog.tracks.map(t => [t.id, t]))
    return playlist.trackIds.map(id => byId.get(id)).filter(Boolean) as Track[]
  }, [catalog, playlist])

  if (!catalog || !playlist) return <div>Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex gap-6 items-end">
        <div className="w-40 h-40 bg-neutral-800 rounded overflow-hidden">
          {playlist.coverUrl && <img className="w-full h-full object-cover" src={playlist.coverUrl} alt={playlist.title} />}
        </div>
        <div>
          <div className="text-xs uppercase text-white/60">Playlist</div>
          <h1 className="text-4xl font-extrabold leading-tight">{playlist.title}</h1>
          {playlist.description && <div className="text-white/70 text-sm">{playlist.description}</div>}
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
            {tracks.map((t, i) => (
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