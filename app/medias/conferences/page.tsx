export default function ConferencesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-purple-950 px-6 py-16 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-10">
        <div className="absolute left-10 top-20 text-[170px]">🎙️</div>
        <div className="absolute bottom-20 right-16 text-[160px]">✨</div>
      </div>

      <section className="relative mx-auto max-w-7xl">
        <a href="/" className="font-bold text-yellow-300">← Retour à l&apos;accueil</a>

        <p className="mt-12 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
          Impact • Réveil • Transformation
        </p>

        <h1 className="mt-4 text-5xl font-black md:text-7xl">Conférences</h1>

        <p className="mt-8 max-w-4xl text-lg leading-8 text-purple-100">
          Les conférences AFVN sont des temps forts de révélation, d&apos;enseignement et d&apos;activation
          spirituelle pour toute l&apos;Église.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {["photo-1.jpg", "photo-2.jpg", "photo-3.jpg", "photo-4.jpg"].map((photo) => (
            <img key={photo} src={`/medias/conferences/${photo}`} alt="Conférence AFVN" className="h-80 w-full rounded-[2rem] object-cover shadow-2xl" />
          ))}

          <video controls className="h-80 w-full rounded-[2rem] object-cover shadow-2xl md:col-span-2">
            <source src="/medias/conferences/video-1.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </main>
  );
}