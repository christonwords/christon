import { Instagram, Music2, Youtube, Twitter, ShoppingBag, Headphones } from 'lucide-react';

export function Socials() {
  return (
    <div className="card p-6">
      <h2 className="heading text-2xl mb-4">Connect</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <a className="btn w-full justify-center" href="https://instagram.com/christonwords" target="_blank" rel="noreferrer"><Instagram className="h-4 w-4"/> Instagram</a>
        <a className="btn w-full justify-center" href="https://www.tiktok.com/@christonwords" target="_blank" rel="noreferrer"><Music2 className="h-4 w-4"/> TikTok</a>
        <a className="btn w-full justify-center" href="https://youtube.com/@christoncl" target="_blank" rel="noreferrer"><Youtube className="h-4 w-4"/> YouTube</a>
        <a className="btn w-full justify-center" href="https://twitter.com/christonwords" target="_blank" rel="noreferrer"><Twitter className="h-4 w-4"/> X / Twitter</a>
        <a className="btn w-full justify-center" href="https://open.spotify.com/artist/6LgDkSbPafoOa0Yl5HlIjG?si=fyAORRLsS-WCFhhg8qGaTw" target="_blank" rel="noreferrer"><Headphones className="h-4 w-4"/> Spotify</a>
        <a className="btn w-full justify-center" href="#merch"><ShoppingBag className="h-4 w-4"/> Merch</a>
      </div>
    </div>
  );
}