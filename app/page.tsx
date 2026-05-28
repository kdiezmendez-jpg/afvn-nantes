export default function Home() {
  return (
    <main className="bg-white text-slate-950">
      <header className="fixed top-0 left-0 z-50 w-full bg-white/90 backdrop-blur border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <img src="/logo-afvn.png" alt="AFVN Nantes" className="h-14 w-auto" />

          <nav className="hidden md:flex gap-8 font-semibold text-slate-900">
            <a href="#accueil">Accueil</a>
            <a href="#apropos">À propos</a>
            <a href="#pasteur">Pasteur</a>
            <a href="#enseignements">Enseignements</a>
            <a href="#evenements">Événements</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href="#contact" className="rounded-full bg-yellow-600 px-5 py-3 font-bold text-white hover:bg-yellow-700">
            Nous visiter
          </a>
        </div>
      </header>

      <section id="accueil" className="pt-24">
        <img src="/hero-afvn.png" alt="AFVN Nantes" className="h-[80vh] w-full object-cover" />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-600">
          Assemblées Fleuve de Vie pour les Nations
        </p>

        <h1 className="mb-6 text-4xl font-black md:text-6xl">Église de Nantes</h1>

        <p className="mx-auto max-w-3xl text-xl leading-9 text-slate-700">
          Une Église où la Parole et l&apos;Esprit s&apos;accordent pour engendrer des porteurs de vie.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 md:flex-row">
          <a href="#contact" className="rounded-full bg-yellow-600 px-8 py-4 font-bold text-white">
            Nous rendre visite
          </a>
          <a href="#enseignements" className="rounded-full border border-yellow-600 px-8 py-4 font-bold text-yellow-700">
            Enseignements
          </a>
          <a href="#televerser" className="rounded-full bg-slate-950 px-8 py-4 font-bold text-white">
            Téléverser une vidéo
          </a>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-white/10 p-10">
            <p className="font-bold text-yellow-500">Vendredi</p>
            <h2 className="mt-3 text-3xl font-black">Enseignement & Intercession</h2>
            <p className="mt-4 text-xl">19h00 — 20h30</p>
          </div>

          <div className="rounded-3xl bg-white/10 p-10">
            <p className="font-bold text-yellow-500">Dimanche</p>
            <h2 className="mt-3 text-3xl font-black">Grande célébration</h2>
            <p className="mt-4 text-xl">09h30 — 11h30</p>
          </div>
        </div>
      </section>

      <section id="apropos" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-8 text-4xl font-black">Qui sommes-nous ?</h2>
        <p className="max-w-4xl text-lg leading-9 text-slate-700">
          Née dans le cœur de l’Apôtre Pamphile Jean Sylvain MAYINGUIDI depuis la fin de l’année 1988,
          la Communauté des Assemblées Fleuve de Vie pour les Nations s’est développée au Congo,
          en RDC puis en France. L’assemblée de Nantes a été implantée le 10 mars 2024.
        </p>
      </section>

      <section id="pasteur" className="bg-slate-50 px-6 py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[320px_1fr]">
          <div className="flex justify-center md:justify-end">
            <img
              src="/pasteur-diez.jpg"
              alt="Pasteur Diez Mendez Kambault"
              className="h-72 w-72 rounded-full border-8 border-yellow-600 object-cover shadow-2xl"
            />
          </div>

          <div className="text-center md:text-left">
            <p className="font-bold uppercase tracking-[0.2em] text-yellow-600">
              Pasteur local
            </p>

            <h2 className="mt-4 text-4xl font-black text-slate-950">
              Pasteur Diez Mendez Kambault
            </h2>

            <p className="mt-6 text-lg leading-9 text-slate-700">
              Marié et père d’une fille, le Pasteur Diez Mendez Kambault prêche
              l’Évangile depuis 2013. Son ministère est basé sur la formation
              des disciples, le mentorat transformationnel et l’accompagnement
              spirituel.
            </p>

            <p className="mt-5 text-lg leading-9 text-slate-700">
              Missionnaire depuis 2014, il porte une vision centrée sur
              l’édification des croyants, la révélation de l’identité en Christ
              et l’impact des nations par la puissance de Dieu.
            </p>
          </div>
        </div>
      </section>

      <section id="enseignements" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-6 text-4xl font-black">Prédications & Enseignements</h2>
        <p className="mb-8 max-w-3xl text-lg text-slate-700">
          Retrouvez nos messages, enseignements bibliques et temps d’exhortation.
        </p>

        <a href="https://www.youtube.com/watch?v=SqzKK640mww" target="_blank" className="inline-block rounded-full bg-yellow-600 px-8 py-4 font-bold text-white">
          Voir sur YouTube
        </a>
      </section>

      <section id="televerser" className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-black">Téléverser une vidéo</h2>
          <input type="file" accept="video/*" className="rounded-xl bg-white p-4 text-slate-950" />
        </div>
      </section>

      <section id="evenements" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-10 text-4xl font-black">Événements</h2>

        <div className="grid gap-6 md:grid-cols-4">
          {["Conférences", "Séminaires", "Veillées de prière", "Worship sessions"].map((item) => (
            <div key={item} className="rounded-3xl border p-8 shadow-sm">
              <h3 className="text-xl font-black">{item}</h3>
              <p className="mt-4 text-slate-600">Venez vivre un temps fort dans la présence de Dieu.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-6 text-4xl font-black">Nous contacter</h2>
          <p className="text-lg">69 bis, rue du Bêle, 44300 Nantes</p>
          <p className="mt-2 text-lg font-bold">+33 7 67 10 30 45</p>
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
            <p><a href="#apropos">À propos</a></p>
            <p><a href="#pasteur">Pasteur</a></p>
            <p><a href="#enseignements">Enseignements</a></p>
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