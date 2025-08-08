import { Suspense, useEffect, useRef } from 'react';
import './index.css';
import { HeadlinerTicker } from './components/HeadlinerTicker';
import { Hero } from './components/Hero';
import { Merch } from './components/Merch';
import { Music } from './components/Music';
import { Unreleased } from './components/Unreleased';
import { Production } from './components/Production';
import { Socials } from './components/Socials';
import { AdminGate } from './components/AdminGate';
import { AiDevPanel } from './components/AiDevPanel';
import VANTA from 'vanta/dist/vanta.waves.min';
import * as THREE from 'three';

function App() {
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const vantaInstance = useRef<any>(null);

  useEffect(() => {
    if (!vantaRef.current) return;
    vantaInstance.current = VANTA.WAVES({
      el: vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x111111,
      shininess: 35.0,
      waveHeight: 15.0,
      waveSpeed: 0.75,
      zoom: 0.85,
    });
    return () => {
      if (vantaInstance.current) vantaInstance.current.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div ref={vantaRef} className="fixed inset-0 -z-10 opacity-70" />
      <header className="sticky top-0 z-30 border-b border-zinc-800/60 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/30">
        <div className="container-pro flex items-center justify-between py-4">
          <a href="#" className="heading text-xl">Christon</a>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#music" className="subtle hover:text-white transition-colors">Music</a>
            <a href="#unreleased" className="subtle hover:text-white transition-colors">Unreleased</a>
            <a href="#production" className="subtle hover:text-white transition-colors">Production</a>
            <a href="#merch" className="subtle hover:text-white transition-colors">Merch</a>
            <a href="#socials" className="subtle hover:text-white transition-colors">Socials</a>
            <AdminGate />
          </nav>
        </div>
      </header>

      <main className="container-pro grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 py-8">
        <section className="space-y-10">
          <Hero />
          <div id="music">
            <Music />
          </div>
          <div id="unreleased">
            <Unreleased />
          </div>
          <div id="production">
            <Production />
          </div>
          <div id="merch">
            <Merch />
          </div>
          <div id="socials">
            <Socials />
          </div>
        </section>

        <aside className="lg:sticky lg:top-20 h-fit">
          <HeadlinerTicker />
          <div className="mt-6">
            <Suspense fallback={null}>
              <AiDevPanel />
            </Suspense>
          </div>
        </aside>
      </main>

      <footer className="border-t border-zinc-800/60 py-8">
        <div className="container-pro text-xs subtle">
          © {new Date().getFullYear()} Christon. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
