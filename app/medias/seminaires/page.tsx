export default function SeminairesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black px-6 py-16 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-10">
        <div className="absolute left-10 top-20 text-[170px]">📖</div>
        <div className="absolute bottom-20 right-16 text-[150px]">✍️</div>
      </div>

      <section className="relative mx-auto max-w-7xl">
        <a href="/" className="font-bold text-yellow-500">← Retour à l&apos;accueil</a>

        <p className="mt-12 text-sm font-bold uppercase tracking-[0.3em] text-yellow-500">
          Formation • Équipement • Croissance
        </p>

        <h1 className="mt-4 text-5xl font-black md:text-7xl">Séminaires</h1>

        <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-300">
          Les séminaires AFVN ont pour objectif d&apos;équiper les croyants afin qu&apos;ils deviennent
          des disciples matures, formés et utiles pour le Royaume de Dieu.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {["photo-1.jpg", "photo-2.jpg", "photo-3.jpg", "photo-4.jpg"].map((photo) => (
            <img key={photo} src={`/medias/seminaires/${photo}`} alt="Séminaire AFVN" className="h-80 w-full rounded-[2rem] object-cover shadow-2xl" />
          ))}

          <video controls className="h-80 w-full rounded-[2rem] object-cover shadow-2xl md:col-span-2">
            <source src="/medias/seminaires/video-1.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </main>
  );
}