export default function EschatosPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07152f] px-6 py-16 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-10">
        <div className="absolute left-10 top-20 text-[180px]">⛰️</div>
        <div className="absolute bottom-20 right-10 text-[180px]">🔥</div>
      </div>

      <section className="relative mx-auto max-w-7xl">
        <a href="/" className="font-bold text-yellow-400">← Retour à l&apos;accueil</a>

        <p className="mt-12 text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
          Conférence annuelle d&apos;eschatologie
        </p>

        <h1 className="mt-4 text-5xl font-black md:text-7xl">ESCHATOS 2026</h1>

        <h2 className="mt-6 text-2xl font-bold text-yellow-400">
          La bataille de Gog et Magog sur les Montagnes d&apos;Israël
        </h2>

        <p className="mt-8 max-w-4xl text-lg leading-8 text-blue-100">
          ESCHATOS est la conférence annuelle des Assemblées Fleuve de Vie pour les Nations consacrée à
          l&apos;étude des temps de la fin, des prophéties bibliques et des événements annonçant le retour
          glorieux de notre Seigneur Jésus-Christ.
        </p>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-blue-100">
          Cette édition a également marqué la présentation officielle du premier ouvrage du Pasteur Diez
          Mendez Kambault : <span className="font-bold text-yellow-400">« La Dernière Génération ».</span>
        </p>

        <a
          href="https://diezmendez.org/boutique"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block rounded-full bg-yellow-500 px-8 py-4 font-bold text-slate-950 hover:bg-yellow-400"
        >
          Se procurer le livre
        </a>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {["photo-1.jpg", "photo-2.jpg", "photo-3.jpg", "photo-4.jpg"].map((photo) => (
            <img key={photo} src={`/medias/eschatos/${photo}`} alt="ESCHATOS 2026" className="h-80 w-full rounded-[2rem] object-cover shadow-2xl" />
          ))}

          <video controls className="h-80 w-full rounded-[2rem] object-cover shadow-2xl md:col-span-2">
            <source src="/medias/eschatos/video-1.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </main>
  );
}