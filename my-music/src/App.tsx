import { Outlet } from 'react-router-dom'
import { Player } from './components/Player'

export default function App() {
  return (
    <div className="h-full grid grid-rows-[1fr_auto]">
      <div className="grid grid-cols-[260px_1fr]">
        <aside className="bg-black/70 border-r border-white/10 p-4 hidden md:block">
          <div className="text-2xl font-bold mb-6">MyMusic</div>
          <nav className="space-y-2 text-sm">
            <a className="block px-3 py-2 rounded hover:bg-white/5" href="/">Home</a>

            <a className="block px-3 py-2 rounded hover:bg-white/5" href="/admin">Admin</a>
          </nav>
        </aside>
        <main className="min-h-0">
          <header className="sticky top-0 z-10 backdrop-blur bg-neutral-900/70 border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
              <div className="text-lg font-semibold">Welcome</div>
              <div className="ml-auto">
                <a className="text-xs px-3 py-1 rounded-full bg-brand/10 text-brand hover:bg-brand/20" href="/admin">Upload</a>
              </div>
            </div>
          </header>
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
      <footer className="border-t border-white/10 bg-neutral-950/80">
        <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-white/70 flex items-center justify-between">
          <div>Now Playing: none</div>
          <div>
            <Player />
          </div>
        </div>
      </footer>
    </div>
  )
}
