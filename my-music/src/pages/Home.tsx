import { useEffect, useState } from 'react'
import type { Catalog } from '../lib/catalog'
import { loadCatalog } from '../lib/catalog'

export default function Home() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCatalog().then(setCatalog).catch((e) => setError(String(e)))
  }, [])

  if (error) return <div className="text-red-400">{error}</div>
  if (!catalog) return <div>Loading…</div>

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {catalog.albums.map((album) => (
            <a key={album.id} href={`/album/${album.id}`} className="group">
              <div className="bg-white/5 group-hover:bg-white/10 transition rounded-lg p-3">
                <div className="aspect-square rounded-md bg-neutral-800 overflow-hidden">
                  {album.coverUrl && <img className="w-full h-full object-cover" src={album.coverUrl} alt={album.title} />}
                </div>
                <div className="mt-3 font-semibold truncate">{album.title}</div>
                <div className="text-xs text-white/60 truncate">{album.artist}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {catalog.playlists.map((pl) => (
            <a key={pl.id} href={`/playlist/${pl.id}`} className="group">
              <div className="bg-white/5 group-hover:bg-white/10 transition rounded-lg p-3">
                <div className="aspect-square rounded-md bg-neutral-800 overflow-hidden">
                  {pl.coverUrl && <img className="w-full h-full object-cover" src={pl.coverUrl} alt={pl.title} />}
                </div>
                <div className="mt-3 font-semibold truncate">{pl.title}</div>
                {pl.description && <div className="text-xs text-white/60 truncate">{pl.description}</div>}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}