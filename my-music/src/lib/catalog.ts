export type Track = {
  id: string
  title: string
  artist: string
  durationSec: number
  audioUrl: string
  coverUrl?: string
  plays?: number
}

export type Album = {
  id: string
  title: string
  artist: string
  coverUrl?: string
  year?: number
  tracks: Track[]
}

export type Playlist = {
  id: string
  title: string
  description?: string
  coverUrl?: string
  trackIds: string[]
}

export type Catalog = {
  tracks: Track[]
  albums: Album[]
  playlists: Playlist[]
}

export async function loadCatalog(): Promise<Catalog> {
  const url = `${import.meta.env.BASE_URL}catalog.json`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load catalog')
  return res.json()
}