import { useEffect, useRef, useState } from 'react'

export function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    isPlaying ? audio.play().catch(() => {}) : audio.pause()
  }, [isPlaying])

  return (
    <div className="flex items-center gap-3">
      <button className="px-3 py-1 rounded bg-brand text-black text-sm" onClick={() => setIsPlaying(v => !v)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <audio ref={audioRef} src="" />
    </div>
  )
}