import { Play, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="card p-8 md:p-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h1 className="heading text-4xl md:text-6xl">Christon</h1>
            <p className="subtle mt-3 max-w-2xl">18-year-old hip hop artist and producer. Writing since 8. New sounds. Real stories.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="#music" className="btn btn-primary">
              <Play className="h-4 w-4" /> Stream Music
            </a>
            <a href="#merch" className="btn">
              <ArrowRight className="h-4 w-4" /> Shop
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}