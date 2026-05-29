export default function VieEgliseLocalePage() {
  const photos = [
    "/eglise/photo-1.jpg",
    "/eglise/photo-2.jpg",
    "/eglise/photo-3.jpg",
    "/eglise/photo-4.jpg",
    "/eglise/photo-5.jpg",
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-7xl">
        <a href="/" className="font-bold text-yellow-500">← Retour à l’accueil</a>

        <p className="mt-12 text-sm font-bold uppercase tracking-[0.3em] text-yellow-500">
          Vie de l’église locale
        </p>

        <h1 className="mt-4 text-5xl font-black">
          Nos cultes, notre famille, notre atmosphère
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
          Découvrez la vie de l’AFVN Nantes : des temps d’adoration,
          d’enseignement, de prière, de communion fraternelle et de croissance
          spirituelle.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {photos.map((photo) => (
            <img
              key={photo}
              src={photo}
              alt="Vie de l’église AFVN Nantes"
              className="h-72 w-full rounded-[2rem] object-cover shadow-2xl"
            />
          ))}
        </div>
      </section>
    </main>
  );
}