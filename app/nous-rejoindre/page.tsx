export default function NousRejoindrePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f4fd8] via-[#245fd9] to-[#b779d6] px-6 py-16 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_30%),radial-gradient(circle_at_80%_50%,rgba(185,120,220,0.45),transparent_35%)]" />

      <section className="relative z-10 mx-auto max-w-6xl">
        <a href="/" className="font-bold text-white/90">
          ← Retour à l’accueil
        </a>

        <div className="mt-10 overflow-hidden rounded-[2rem] shadow-2xl">
          <img
            src="/medias/banniere-afvn.png"
            alt="Bienvenue à la Maison"
            className="w-full object-cover"
          />
        </div>

        <div className="mx-auto mt-14 max-w-4xl rounded-[2rem] bg-white/15 p-10 text-center shadow-2xl backdrop-blur-md">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/80">
            Rejoindre l’AFVN Nantes
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            Devenez membre de notre famille spirituelle
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/90">
            Vous êtes nouveau, de passage, ou vous souhaitez faire partie de notre communauté ?
            Nous serions heureux de vous accueillir, de vous accompagner et de marcher avec vous
            dans votre croissance spirituelle.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/90">
            Cliquez sur le bouton ci-dessous ou scannez le QR code présent sur notre visuel pour remplir
            le formulaire d’accueil.
          </p>

          <a
            href="https://docs.google.com/forms/d/11yv9hO10gIfw47VwN3dkbMTFb-r2MjDc5bxwPiK1Jkk/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block rounded-full bg-white px-10 py-4 text-lg font-black text-blue-700 shadow-2xl transition hover:scale-105"
          >
            Accéder au formulaire
          </a>
        </div>
      </section>
    </main>
  );
}