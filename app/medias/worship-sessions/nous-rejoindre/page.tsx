export default function NousRejoindrePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-500 px-6 py-16 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_35%)]" />

      <section className="relative mx-auto max-w-5xl">
        <a href="/medias/worship-sessions" className="font-bold text-white/90">
          ← Retour
        </a>

        <div className="mt-10 overflow-hidden rounded-[2rem] shadow-2xl">
          <img
            src="/medias/banniere-afvn.png"
            alt="Bienvenue à la Maison"
            className="w-full object-cover"
          />
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/20 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/80">
            L&apos;AFVN
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-7xl">
            Nous rejoindre
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/85">
            Bienvenue à la Maison ! Remplissez le formulaire afin que notre
            équipe puisse vous accueillir, vous contacter et vous accompagner
            dans votre intégration à l&apos;église.
          </p>

          <a
            href="https://docs.google.com/forms/d/11yv9hO10gIfw47VwN3dkbMTFb-r2MjDc5bxwPiK1Jkk/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block rounded-full bg-white px-10 py-4 text-lg font-black text-indigo-700 shadow-xl transition hover:scale-105"
          >
            Accéder au formulaire
          </a>

          <p className="mt-5 text-sm text-white/60">
            Formulaire sécurisé via Google Forms
          </p>
        </div>
      </section>
    </main>
  );
}