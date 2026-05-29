export default function LesAfvnPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-yellow-500 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-700 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <a href="/" className="font-bold text-yellow-500">
            ← Retour à l’accueil
          </a>

          <p className="mt-14 text-sm font-bold uppercase tracking-[0.35em] text-yellow-500">
            Les AFVN
          </p>

          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
            Assemblées Fleuve de Vie pour les Nations
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">
            Une vision apostolique portée par la Parole, l’Esprit et la Croix,
            afin de former des porteurs de vie pour les nations.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:grid-cols-[420px_1fr]">
        <div>
          <div className="overflow-hidden rounded-[2rem] border-4 border-yellow-600 shadow-2xl">
            <img
              src="/visionnaires-mayinguidi.jpg"
              alt="Apôtre Pamphile Jean Sylvain MAYINGUIDI et Ancienne Octavie Estelle MAYINGUIDI"
              className="h-[520px] w-full object-cover"
            />
          </div>

          <div className="mt-6 rounded-[2rem] bg-slate-950 p-6 text-center text-white shadow-xl">
            <h2 className="text-2xl font-black text-yellow-500">
              Apôtre Pamphile Jean Sylvain MAYINGUIDI
            </h2>

            <p className="mt-2 text-slate-300">
              Visionnaire des Assemblées Fleuve de Vie pour les Nations
            </p>

            <div className="my-5 h-px bg-white/10" />

            <h3 className="text-xl font-black text-yellow-500">
              Ancienne Octavie Estelle MAYINGUIDI
            </h3>

            <p className="mt-2 text-slate-300">
              Son épouse
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-700">
            Historique & Vision
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Une vision née pour répandre la vie de Dieu.
          </h2>

          <p className="mt-8 text-lg leading-9 text-slate-700">
            Née dans le cœur de son leader, l’Apôtre Pamphile Jean Sylvain
            MAYINGUIDI, depuis la fin de l’année 1988, la vision des Assemblées
            Fleuve de Vie pour les Nations a commencé à se développer en
            République du Congo avant de se déployer en République Démocratique
            du Congo, puis en France.
          </p>

          <p className="mt-6 text-lg leading-9 text-slate-700">
            Les AFVN portent une vision centrée sur la communication de la vie
            de Dieu à travers la prédication de l’Évangile. Cette vie est
            transmise par des hommes et des femmes enseignés, transformés et
            appelés à devenir de véritables porteurs de vie.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-bold uppercase text-yellow-700">
                La Parole
              </p>
              <p className="mt-3 text-slate-700">
                La révélation vivante de Dieu, reçue, confessée et transmise.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-bold uppercase text-yellow-700">
                L’Esprit
              </p>
              <p className="mt-3 text-slate-700">
                La puissance de Dieu qui conduit, transforme et équipe.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-bold uppercase text-yellow-700">
                La Croix
              </p>
              <p className="mt-3 text-slate-700">
                Le fondement de la mort à soi et de la vie nouvelle en Christ.
              </p>
            </div>
          </div>

          <p className="mt-8 text-lg leading-9 text-slate-700">
            Le symbole du fleuve exprime l’Évangile en mouvement : une vie qui
            coule, se répand et atteint les nations par l’implantation
            d’églises de proximité et par la formation de disciples capables
            d’impacter leur génération.
          </p>
        </div>
      </section>
    </main>
  );
}