import { useEffect, useRef } from 'react';

const SEARCH_URL = 'https://twitter.com/search?q=hip%20hop%20OR%20rapper%20OR%20%22new%20music%22%20OR%20Drake%20OR%20Kendrick%20OR%20J.%20Cole%20OR%20Travis%20Scott&src=typed_query&f=live';

export function HeadlinerTicker() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anchor = document.createElement('a');
    anchor.setAttribute('class', 'twitter-timeline');
    anchor.setAttribute('data-theme', 'dark');
    anchor.setAttribute('data-height', '420');
    anchor.setAttribute('href', SEARCH_URL);
    anchor.textContent = 'Hip-Hop Live Tweets';
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(anchor);

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
        <div className="text-xs subtle">Live tweets matching hip hop topics and artists.</div>
      </div>
    </div>
  );
}