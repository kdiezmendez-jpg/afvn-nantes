export default function Home() {
  const events = [
    { title: "Conférences", href: "/medias/conferences" },
    { title: "Séminaires", href: "/medias/seminaires" },
    { title: "ESCHATOS 2026", href: "/medias/eschatos" },
    { title: "Worship sessions", href: "/medias/worship-sessions" },
  ];

  return (
    <main className="bg-white text-slate-950">
      <header className="fixed left-0 top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <a href="#accueil" className="flex flex-col items-center">
            <img src="/logo-afvn.png" alt="AFVN Nantes" className="h-14 w-auto" />
            <span className="mt-1 rounded-full bg-yellow-600 px-4 py-1 text-xs font-bold text-white hover:bg-yellow-700">
              Accueil
            </span>
          </a>

          <nav className="hidden items-center gap-8 font-semibold text-slate-900 md:flex">
            <div className="group relative">
              <button className="hover:text-yellow-700">À propos</button>

              <div className="invisible absolute left-0 top-8 z-50 w-72 rounded-2xl bg-white p-3 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:opacity-100">
                <a href="/apropos/les-afvn" className="block rounded-xl px-4 py-3 hover:bg-yellow-50">
                  Les AFVN
                </a>
                <a href="/apropos/pasteur-local" className="block rounded-xl px-4 py-3 hover:bg-yellow-50">
                  Le Pasteur local
                </a>
                <a href="/apropos/vie-eglise-locale" className="block rounded-xl px-4 py-3 hover:bg-yellow-50">
                  La vie de l’église locale
                </a>
              </div>
            </div>

            <a href="#enseignements">Enseignements</a>
            <a href="#evenements">Événements</a>
            <a href="/nous-rejoindre">Nous rejoindre</a>
            <a href="#contact">Contact</a>
          </nav>

          <a
            href="#contact"
            className="rounded-full bg-yellow-600 px-5 py-3 font-bold text-white hover:bg-yellow-700"
          >
            Nous visiter
          </a>
        </div>
      </header>

      <section id="accueil" className="pt-28">
        <img
          src="/hero-afvn.png"
          alt="AFVN Nantes"
          className="h-[80vh] w-full object-cover"
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-600">
          Assemblées Fleuve de Vie pour les Nations
        </p>

        <h1 className="mb-6 text-4xl font-black md:text-6xl">
          Église de Nantes
        </h1>

        <p className="mx-auto max-w-3xl text-xl leading-9 text-slate-700">
          Une Église où la Parole et l&apos;Esprit s&apos;accordent pour engendrer des porteurs de vie.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 md:flex-row">
          <a
            href="#contact"
            className="rounded-full bg-yellow-600 px-8 py-4 font-bold text-white hover:bg-yellow-700"
          >
            Nous rendre visite
          </a>

          <a
            href="#enseignements"
            className="rounded-full border border-yellow-600 px-8 py-4 font-bold text-yellow-700 hover:bg-yellow-50"
          >
            Enseignements
          </a>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-white/10 p-10">
            <p className="font-bold text-yellow-500">Vendredi</p>
            <h2 className="mt-3 text-3xl font-black">
              Enseignement & Intercession
            </h2>
            <p className="mt-4 text-xl">19h00 — 20h30</p>
          </div>

          <div className="rounded-3xl bg-white/10 p-10">
            <p className="font-bold text-yellow-500">Dimanche</p>
            <h2 className="mt-3 text-3xl font-black">Grande célébration</h2>
            <p className="mt-4 text-xl">09h30 — 11h30</p>
          </div>
        </div>
      </section>

      <section id="enseignements" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-6 text-4xl font-black">
          Prédications & Enseignements
        </h2>

        <p className="mb-8 max-w-3xl text-lg text-slate-700">
          Retrouvez nos messages, enseignements bibliques et temps d’exhortation.
        </p>

        <a
          href="https://www.youtube.com/@AfvnEgliseDeNantes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-yellow-600 px-8 py-4 font-bold text-white hover:bg-yellow-700"
        >
          Voir notre chaîne YouTube
        </a>
      </section>

      <section id="evenements" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-10 text-4xl font-black">Événements</h2>

        <div className="grid gap-6 md:grid-cols-4">
          {events.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="rounded-3xl border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="mt-4 text-slate-600">
                Voir les photos et vidéos disponibles.
              </p>
            </a>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-6 text-4xl font-black">Nous contacter</h2>
          <p className="text-lg">69 bis, rue du Bêle, 44300 Nantes</p>
          <p className="mt-2 text-lg font-bold">+33 7 67 10 30 45</p>

          <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
            <a
              href="tel:+33767103045"
              className="rounded-full bg-yellow-600 px-8 py-4 font-bold text-white hover:bg-yellow-700"
            >
              Appeler
            </a>

            <a
              href="https://www.instagram.com/afvnnantes/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-8 py-4 font-bold hover:bg-white"
            >
              Instagram
            </a>

            <a
              href="https://www.facebook.com/people/AFVN-%C3%89glise-de-Nantes/61586115265972/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-8 py-4 font-bold hover:bg-white"
            >
              Facebook
            </a>

            <a
              href="https://maps.google.com/?q=69+bis+rue+du+Bêle+44300+Nantes"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-8 py-4 font-bold hover:bg-white"
            >
              Itinéraire
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div>
            <img src="/logo-afvn.png" alt="AFVN" className="mb-4 h-16 w-auto" />
            <p className="text-slate-300">
              Une Église où la Parole et l&apos;Esprit s&apos;accordent pour engendrer des porteurs de vie.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-black text-yellow-500">Navigation</h3>
            <p><a href="/apropos/les-afvn">Les AFVN</a></p>
            <p><a href="/apropos/pasteur-local">Le Pasteur local</a></p>
            <p><a href="/apropos/vie-eglise-locale">La vie de l’église locale</a></p>
            <p><a href="#enseignements">Enseignements</a></p>
            <p><a href="/nous-rejoindre">Nous rejoindre</a></p>
            <p><a href="#contact">Contact</a></p>
          </div>

          <div>
            <h3 className="mb-4 font-black text-yellow-500">Horaires</h3>
            <p>Vendredi : 19h00 — 20h30</p>
            <p>Dimanche : 09h30 — 11h30</p>
          </div>

          <div>
            <h3 className="mb-4 font-black text-yellow-500">Contact</h3>
            <p>69 bis, rue du Bêle</p>
            <p>44300 Nantes</p>
            <p>+33 7 67 10 30 45</p>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-slate-400">
          © 2026 AFVN Nantes — Tous droits réservés.
        </p>
      </footer>
    </main>
  );
}