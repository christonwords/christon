export function Music() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading text-2xl">Stream My Music</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <iframe
            style={{ borderRadius: 12 }}
            src="https://open.spotify.com/embed/artist/6LgDkSbPafoOa0Yl5HlIjG?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
        <div className="space-y-3">
          <a className="btn btn-primary w-full justify-center" href="https://music.apple.com/us/artist/christon/1782316214" target="_blank" rel="noreferrer">Listen on Apple Music</a>
          <a className="btn w-full justify-center" href="https://youtube.com/@christoncl" target="_blank" rel="noreferrer">Watch on YouTube</a>
          <a className="btn w-full justify-center" href="https://www.tiktok.com/@christonwords" target="_blank" rel="noreferrer">Follow on TikTok</a>
          <a className="btn w-full justify-center" href="https://twitter.com/christonwords" target="_blank" rel="noreferrer">Follow on X</a>
        </div>
      </div>
    </div>
  );
}