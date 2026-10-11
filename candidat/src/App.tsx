import { useEffect, useState } from "react";
import { Users, BriefcaseBusiness, ArrowRight, Zap } from "lucide-react";
import CandidatureForm from "./components/CandidatureForm";

function App() {
  const [espace, setEspace] = useState<"accueil" | "candidat">(() =>
    window.location.hash === "#candidat" ? "candidat" : "accueil",
  );

  useEffect(() => {
    const synchroniserEspace = () => {
      setEspace(window.location.hash === "#candidat" ? "candidat" : "accueil");
    };

    window.addEventListener("hashchange", synchroniserEspace);
    return () => window.removeEventListener("hashchange", synchroniserEspace);
  }, []);

  const ouvrirEspaceCandidat = () => {
    if (window.location.hash !== "#candidat") {
      window.location.hash = "candidat";
    } else {
      setEspace("candidat");
    }
  };

  const retournerAccueil = () => {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    setEspace("accueil");
  };

  // url publique de l'application recruteur
  const urlRecruteur = import.meta.env.VITE_RECRUTEUR_URL || "";

  if (espace === "candidat") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto mb-6 max-w-3xl">
          <button
            type="button"
            onClick={retournerAccueil}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ← Retour à l'accueil
          </button>
        </div>

        <CandidatureForm />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <header className="w-full max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <Zap size={28} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            SKULLVI
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Talent Engine
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
            Une solution pour recevoir les candidatures, qualifier les profils et
            identifier les candidats à examiner en priorité.
          </p>
        </header>

        <section className="mt-12 w-full" aria-labelledby="choix-espace">
          <div className="text-center">
            <h2 id="choix-espace" className="text-xl font-semibold text-slate-900">
              Choisissez votre espace
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sélectionnez l'espace correspondant à votre besoin.
            </p>
          </div>

          <div className="mt-6 grid w-full gap-5 sm:grid-cols-2">
          <button
            onClick={ouvrirEspaceCandidat}
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:p-7"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={26} />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Espace candidat</h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Soumettez votre candidature et présentez vos compétences, vos
              projets et votre parcours.
            </p>

            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600">
              Déposer une candidature
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </span>
          </button>

          <button
            onClick={() => {
              if (urlRecruteur) {
                window.location.href = urlRecruteur;
              } else {
                alert(
                  "L'espace recruteur sera accessible lorsque son URL publique sera configurée.",
                );
              }
            }}
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:p-7"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <BriefcaseBusiness size={26} />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Espace recruteur</h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Consultez les candidatures, analysez les scores et identifiez les
              profils prioritaires.
            </p>

            <span className="mt-6 inline-flex items-center gap-2 font-semibold text-green-600">
              Accéder au tableau de bord
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </span>
          </button>
          </div>
        </section>

        <p className="mt-12 text-center text-sm text-slate-400">
          Mini-Challenge — Talent Engine
        </p>
      </div>
    </main>
  );
}

export default App;
