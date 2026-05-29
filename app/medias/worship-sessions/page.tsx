export default function WorshipSessionsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white px-6 py-16 text-slate-950">
      <div className="pointer-events-none fixed inset-0 opacity-10">
        <div className="absolute left-8 top-24 text-[160px]">🎹</div>
        <div className="absolute right-16 top-60 text-[140px]">🎤</div>
        <div className="absolute bottom-16 left-1/3 text-[150px]">🎸</div>
      </div>

      <section className="relative mx-auto max-w-7xl">
        <a href="/" className="font-bold text-yellow-700">
          ← Retour à l&apos;accueil
        </a>

        <p className="mt-12 text-sm font-bold uppercase tracking-[0.3em] text-yellow-700">
          Adoration • Louange • Présence de Dieu
        </p>

        <h1 className="mt-4 text-5xl font-black md:text-7xl">
          Worship Sessions
        </h1>

        <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-700">
          Les Worship Sessions sont des moments spécialement consacrés à la
          louange, à l&apos;adoration et à la recherche de la présence de Dieu.
        </p>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-700">
          À travers les chants, les prières spontanées et les temps de
          communion, nous créons un environnement propice à la rencontre avec le
          Saint-Esprit.
        </p>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-700">
          Retrouvez ici quelques extraits de nos temps d&apos;adoration et de
          célébration.
        </p>

        <h2 className="mt-16 text-3xl font-black">
          Vidéos
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <iframe
            className="aspect-video w-full rounded-[2rem] shadow-2xl"
            src="https://www.youtube.com/embed/SqzKK640mww"
            title="Worship Session AFVN Nantes 1"
            allowFullScreen
          />

          <iframe
            className="aspect-video w-full rounded-[2rem] shadow-2xl"
            src="https://www.youtube.com/embed/5xg0UTFqTYY"
            title="Worship Session AFVN Nantes 2"
            allowFullScreen
          />
        </div>

        <h2 className="mt-20 text-3xl font-black">
          Galerie photos
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <img
            src="/medias/worship-sessions/photo-1.jpg"
            alt="Worship Session AFVN Nantes"
            className="h-96 w-full rounded-[2rem] object-cover shadow-2xl"
          />

          <img
            src="/medias/worship-sessions/photo-2.jpg"
            alt="Worship Session AFVN Nantes"
            className="h-96 w-full rounded-[2rem] object-cover shadow-2xl"
          />
        </div>
      </section>
    </main>
  );
}