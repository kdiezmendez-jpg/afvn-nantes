export default function PasteurLocalPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-6xl">
        <a href="/" className="font-bold text-yellow-500">
          ← Retour à l’accueil
        </a>

        <div className="mt-12 grid items-center gap-12 md:grid-cols-[320px_1fr]">
          <img
            src="/pasteur-diez.jpg"
            alt="Pasteur Diez Mendez Kambault"
            className="h-80 w-80 rounded-full border-8 border-yellow-600 object-cover shadow-2xl"
          />

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-500">
              Pasteur local
            </p>

            <h1 className="mt-4 text-5xl font-black">
              Pasteur Diez Mendez Kambault
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Marié et père d’une fille, le Pasteur Diez Mendez Kambault prêche
              l’Évangile depuis 2013. Son ministère est basé sur la formation
              des disciples, le mentorat transformationnel et l’accompagnement
              spirituel.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}