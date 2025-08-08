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
  const res = await fetch('/catalog.json', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load catalog')
  return res.json()
}