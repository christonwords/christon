import { useEffect, useRef } from 'react';

export function HeadlinerTicker() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anchor = document.createElement('a');
    anchor.setAttribute('class', 'twitter-timeline');
    anchor.setAttribute('data-theme', 'dark');
    anchor.setAttribute('data-height', '420');
    anchor.setAttribute('href', 'https://twitter.com/christonwords');
    anchor.textContent = 'Tweets by @christonwords';
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(anchor);

    // load widgets script once
    const id = 'twitter-wjs';
    if (!document.getElementById(id)) {
      const s = document.createElement('script');
      s.id = id;
      s.src = 'https://platform.twitter.com/widgets.js';
      s.async = true;
      document.body.appendChild(s);
    } else if ((window as any).twttr?.widgets?.load) {
      (window as any).twttr.widgets.load(containerRef.current);
    }
  }, []);

  return (
    <div className="card p-3">
      <div className="heading text-sm mb-2">Hip-Hop Headlines</div>
      <div className="space-y-3">
        <div className="rounded overflow-hidden" ref={containerRef} />
        <div className="text-xs subtle">
          Follow on Instagram @christonwords for more.
        </div>
      </div>
    </div>
  );
}