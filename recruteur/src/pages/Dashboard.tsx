import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  estStatutCandidat,
  STATUTS_CANDIDAT,
  type Candidat,
  type StatutCandidat,
} from "../types/candidat";
import {
  modifierFavori,
  modifierStatut,
  recupererCandidats,
} from "../services/candidats.service";

function Dashboard() {

  const [filtre, setFiltre] = useState<
    "tous" | "prioritaire" | "secondaire" | "a-etudier" | "faible-priorite"
  >("tous");
  const [filtreStatut, setFiltreStatut] = useState<"tous" | StatutCandidat>(
    "tous",
  );
  const [favorisUniquement, setFavorisUniquement] = useState(false);
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [erreurFavori, setErreurFavori] = useState("");
  const [erreurStatut, setErreurStatut] = useState("");
  const [recherche, setRecherche] = useState("");
  const [favoriEnCours, setFavoriEnCours] = useState<number | null>(null);
  const [statutEnCours, setStatutEnCours] = useState<number | null>(null);
  const navigate = useNavigate();
  const urlAccueilCandidat = import.meta.env.VITE_CANDIDAT_URL || document.referrer;

  const ouvrirProfil = (id: number) => {
    navigate(`/candidats/${id}`);
  };

  const retournerAccueilCandidat = () => {
    if (!urlAccueilCandidat) {
      window.history.back();
      return;
    }

    const url = new URL(urlAccueilCandidat, window.location.href);
    url.hash = "";
    window.location.assign(url.toString());
  };

  const basculerFavori = async (id: number) => {
    try {
      setFavoriEnCours(id);
      setErreurFavori("");

      const resultat = await modifierFavori(id);
      setCandidats((candidatsActuels) =>
        candidatsActuels.map((candidat) =>
          candidat.id === id
            ? { ...candidat, favori: resultat.favori }
            : candidat,
        ),
      );
    } catch (error) {
      setErreurFavori(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le favori.",
      );
    } finally {
      setFavoriEnCours(null);
    }
  };

  const changerStatut = async (id: number, statut: StatutCandidat) => {
    try {
      setStatutEnCours(id);
      setErreurStatut("");

      const resultat = await modifierStatut(id, statut);
      setCandidats((candidatsActuels) =>
        candidatsActuels.map((candidat) =>
          candidat.id === id
            ? { ...candidat, statut: resultat.statut }
            : candidat,
        ),
      );
    } catch (error) {
      setErreurStatut(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le statut.",
      );
    } finally {
      setStatutEnCours(null);
    }
  };

  useEffect(() => {
    let actif = true;

    const charger = async () => {
      try {
        const data = await recupererCandidats();

        if (actif) {
          setCandidats(data);
        }
      } catch (error) {
        if (actif) {
          setErreur(
            error instanceof Error ? error.message : "Une erreur est survenue.",
          );
        }
      } finally {
        if (actif) {
          setChargement(false);
        }
      }
    };

    charger();

    return () => {
      actif = false;
    };
  }, []);

  const recharger = async () => {
    try {
      setChargement(true);
      setErreur("");

      const data = await recupererCandidats();

      setCandidats(data);
    } catch (error) {
      setErreur(
        error instanceof Error ? error.message : "Une erreur est survenue.",
      );
    } finally {
      setChargement(false);
    }
  };

  // ==============================
  // STATISTIQUES
  // ==============================

  const totalCandidats = candidats.length;

  const candidatsPrioritaires = candidats.filter(
    (candidat) => candidat.qualification === "Prioritaire",
  ).length;

  const candidatsSecondaires = candidats.filter(
    (candidat) => candidat.qualification === "Secondaire",
  ).length;

  const candidatsAEtudier = candidats.filter(
    (candidat) => candidat.qualification === "À étudier",
  ).length;

  const candidatsFaiblePriorite = candidats.filter(
    (candidat) => candidat.qualification === "Faible priorité",
  ).length;

  const candidatsFiltres = candidats.filter((candidat) => {
    const correspondAuFiltre =
      filtre === "tous" ||
      (filtre === "prioritaire" && candidat.qualification === "Prioritaire") ||
      (filtre === "secondaire" && candidat.qualification === "Secondaire") ||
      (filtre === "a-etudier" && candidat.qualification === "À étudier") ||
      (filtre === "faible-priorite" &&
        candidat.qualification === "Faible priorité");

    const correspondAuStatut =
      filtreStatut === "tous" || candidat.statut === filtreStatut;

    if (
      !correspondAuFiltre ||
      !correspondAuStatut ||
      (favorisUniquement && !candidat.favori)
    ) {
      return false;
    }

    const texteRecherche = recherche.trim().toLowerCase();

    if (!texteRecherche) {
      return true;
    }

    return (
      candidat.nom.toLowerCase().includes(texteRecherche) ||
      candidat.email.toLowerCase().includes(texteRecherche) ||
      candidat.domaine.toLowerCase().includes(texteRecherche) ||
      candidat.niveau.toLowerCase().includes(texteRecherche)
    );
  });
  if (chargement) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Chargement des candidats...</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{erreur}</p>

          <button
            onClick={recharger}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* ==============================
            EN-TÊTE
        ============================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Dashboard recruteur
            </h1>

            <p className="mt-2 text-slate-600">
              Consultez les candidatures et identifiez rapidement les profils
              prioritaires.
            </p>
          </div>

          <button
            type="button"
            onClick={retournerAccueilCandidat}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ← Retour à l'accueil
          </button>
        </div>

        {/* ==============================
            STATISTIQUES
        ============================== */}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* TOTAL */}

          <button
            type="button"
            aria-pressed={filtre === "tous"}
            onClick={() => setFiltre("tous")}
            className={`rounded-xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              filtre === "tous"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <span className="block text-sm font-medium text-slate-500">
              Total candidats
            </span>
            <span className="mt-2 block text-3xl font-bold text-slate-900">
              {totalCandidats}
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              candidatures reçues
            </span>
          </button>

          {/* PRIORITAIRES */}

          <button
            type="button"
            aria-pressed={filtre === "prioritaire"}
            onClick={() => setFiltre("prioritaire")}
            className={`rounded-xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              filtre === "prioritaire"
                ? "border-green-500 bg-green-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <span className="block text-sm font-medium text-slate-500">
              Prioritaires
            </span>
            <span className="mt-2 block text-3xl font-bold text-green-600">
              {candidatsPrioritaires}
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              à examiner en premier
            </span>
          </button>

          {/* SECONDAIRES */}

          <button
            type="button"
            aria-pressed={filtre === "secondaire"}
            onClick={() => setFiltre("secondaire")}
            className={`rounded-xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              filtre === "secondaire"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <span className="block text-sm font-medium text-slate-500">
              Secondaires
            </span>
            <span className="mt-2 block text-3xl font-bold text-blue-600">
              {candidatsSecondaires}
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              profils intéressants
            </span>
          </button>

          {/* À ÉTUDIER */}

          <button
            type="button"
            aria-pressed={filtre === "a-etudier"}
            onClick={() => setFiltre("a-etudier")}
            className={`rounded-xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
              filtre === "a-etudier"
                ? "border-orange-500 bg-orange-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <span className="block text-sm font-medium text-slate-500">
              À étudier
            </span>
            <span className="mt-2 block text-3xl font-bold text-orange-500">
              {candidatsAEtudier}
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              nécessitent une analyse
            </span>
          </button>

          {/* FAIBLE PRIORITÉ */}

          <button
            type="button"
            aria-pressed={filtre === "faible-priorite"}
            onClick={() => setFiltre("faible-priorite")}
            className={`rounded-xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              filtre === "faible-priorite"
                ? "border-red-500 bg-red-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <span className="block text-sm font-medium text-slate-500">
              Faible priorité
            </span>
            <span className="mt-2 block text-3xl font-bold text-red-500">
              {candidatsFaiblePriorite}
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              à relancer plus tard
            </span>
          </button>
        </div>

        <section className="mt-8" aria-labelledby="statuts-heading">
          <div className="mb-4">
            <h2
              id="statuts-heading"
              className="text-xl font-semibold text-slate-900"
            >
              Candidatures par statut
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Sélectionnez un statut pour filtrer la liste des candidats.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STATUTS_CANDIDAT.map((statut) => {
              const nombreCandidats = candidats.filter(
                (candidat) => candidat.statut === statut,
              ).length;
              const selectionne = filtreStatut === statut;

              return (
                <button
                  key={statut}
                  type="button"
                  aria-pressed={selectionne}
                  onClick={() => setFiltreStatut(statut)}
                  className={`rounded-xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    selectionne
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="block text-sm font-medium text-slate-600">
                    {statut}
                  </span>
                  <span className="mt-2 block text-3xl font-bold text-slate-900">
                    {nombreCandidats}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {nombreCandidats === 1 ? "candidat" : "candidats"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==============================
            LISTE DES CANDIDATS
        ============================== */}

        <div className="mt-10">
          <div className="mb-4">
            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              >
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m16 16 4 4" />
              </svg>

              <input
                type="text"
                aria-label="Rechercher un candidat"
                value={recherche}
                onChange={(event) => setRecherche(event.target.value)}
                placeholder="Rechercher par nom, email, domaine ou niveau..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFiltre("tous")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filtre === "tous"
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Tous
              </button>

              <button
                onClick={() => setFiltre("prioritaire")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filtre === "prioritaire"
                    ? "bg-green-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Prioritaires
              </button>

              <button
                onClick={() => setFiltre("secondaire")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filtre === "secondaire"
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Secondaires
              </button>

              <button
                onClick={() => setFiltre("a-etudier")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filtre === "a-etudier"
                    ? "bg-orange-500 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                À étudier
              </button>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              Statut
              <select
                value={filtreStatut}
                onChange={(event) => {
                  const statut = event.target.value;
                  setFiltreStatut(
                    statut === "tous" || estStatutCandidat(statut)
                      ? statut
                      : "tous",
                  );
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="tous">Tous les statuts</option>
                {STATUTS_CANDIDAT.map((statut) => (
                  <option key={statut} value={statut}>
                    {statut}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mb-6">
            <button
              type="button"
              aria-pressed={favorisUniquement}
              onClick={() => setFavorisUniquement((actif) => !actif)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                favorisUniquement
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span aria-hidden="true">{favorisUniquement ? "★" : "☆"}</span>
              {favorisUniquement ? "Favoris uniquement" : "Afficher les favoris"}
            </button>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Candidatures
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Classement des candidats par score.
              </p>
            </div>

            <button
              onClick={recharger}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Actualiser
            </button>
          </div>

          {erreurFavori && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {erreurFavori}
            </p>
          )}
          {erreurStatut && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {erreurStatut}
            </p>
          )}

          <div className="space-y-4">
            {candidatsFiltres.map((candidat) => (
              <div
                key={candidat.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* INFORMATIONS */}

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {candidat.nom}
                    </h3>

                    <p className="text-sm text-slate-500">{candidat.email}</p>
                  </div>

                  {/* SCORE */}

                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {candidat.score}/100
                    </p>

                    <p className="text-sm font-medium text-slate-600">
                      {candidat.qualification}
                    </p>
                  </div>
                </div>

                {/* INFORMATIONS SUPPLÉMENTAIRES */}

                <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-500">Domaine</p>

                    <p className="mt-1 font-medium text-slate-800">
                      {candidat.domaine}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Niveau</p>

                    <p className="mt-1 font-medium text-slate-800">
                      {candidat.niveau}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Expérience</p>

                    <p className="mt-1 font-medium text-slate-800">
                      {candidat.experience} an
                      {candidat.experience > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <label
                    htmlFor={`statut-${candidat.id}`}
                    className="text-sm font-medium text-slate-700"
                  >
                    Statut de la candidature
                  </label>
                  <select
                    id={`statut-${candidat.id}`}
                    value={candidat.statut}
                    onChange={(event) => {
                      const statut = event.target.value;
                      if (estStatutCandidat(statut)) {
                        void changerStatut(candidat.id, statut);
                      }
                    }}
                    disabled={statutEnCours !== null}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-wait disabled:opacity-60"
                  >
                    {STATUTS_CANDIDAT.map((statut) => (
                      <option key={statut} value={statut}>
                        {statut}
                      </option>
                    ))}
                  </select>
                  {statutEnCours === candidat.id && (
                    <span className="text-sm text-slate-500" role="status">
                      Mise à jour...
                    </span>
                  )}
                </div>
                <button
                  onClick={() => ouvrirProfil(candidat.id)}
                  className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Voir le profil →
                </button>
                <button
                  type="button"
                  onClick={() => basculerFavori(candidat.id)}
                  disabled={favoriEnCours !== null}
                  aria-pressed={candidat.favori}
                  aria-label={
                    candidat.favori
                      ? `Retirer ${candidat.nom} des favoris`
                      : `Ajouter ${candidat.nom} aux favoris`
                  }
                  className={`ml-2 mt-4 rounded-lg border px-4 py-2 text-sm font-medium transition disabled:cursor-wait disabled:opacity-60 ${
                    candidat.favori
                      ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {favoriEnCours === candidat.id
                    ? "Mise à jour..."
                    : candidat.favori
                      ? "★ Favori"
                      : "☆ Ajouter aux favoris"}
                </button>
              </div>
            ))}

            {candidatsFiltres.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-slate-500">
                  Aucun candidat ne correspond à ce filtre.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
