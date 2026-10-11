import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  estStatutCandidat,
  STATUTS_CANDIDAT,
  type StatutCandidat,
} from "../types/candidat";
import { modifierStatut, requeteApi } from "../services/candidats.service";

type CandidatDetailType = {
  id: number;

  nom: string;
  email: string;
  telephone: string;

  domaine: string;
  niveau: string;

  competences: string[];

  experience: number;

  portfolio: string;
  github: string;

  projet1: string;
  projet2: string;
  projet3: string;

  cv_url: string;

  disponibilite: string;
  motivation: string;

  score: number;
  qualification: string;
  statut: StatutCandidat;

  created_at: string;
};

const API_URL = "http://localhost:3000";

function CandidatDetail() {
  const { id } = useParams();

  const [candidat, setCandidat] = useState<CandidatDetailType | null>(null);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [erreurStatut, setErreurStatut] = useState("");
  const [miseAJourStatut, setMiseAJourStatut] = useState(false);

  useEffect(() => {
    const chargerCandidat = async () => {
      try {
        const response = await requeteApi(`${API_URL}/candidats/${id}`);

        if (!response.ok) {
          throw new Error("Impossible de récupérer le candidat.");
        }

        const data = await response.json();

        setCandidat(data);
      } catch (error) {
        setErreur(
          error instanceof Error ? error.message : "Une erreur est survenue.",
        );
      } finally {
        setChargement(false);
      }
    };

    chargerCandidat();
  }, [id]);

  const changerStatut = async (statut: StatutCandidat) => {
    if (!candidat) {
      return;
    }

    try {
      setMiseAJourStatut(true);
      setErreurStatut("");
      const resultat = await modifierStatut(candidat.id, statut);
      setCandidat((candidatActuel) =>
        candidatActuel
          ? { ...candidatActuel, statut: resultat.statut }
          : candidatActuel,
      );
    } catch (error) {
      setErreurStatut(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le statut.",
      );
    } finally {
      setMiseAJourStatut(false);
    }
  };

  if (chargement) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Chargement du profil...</p>
      </div>
    );
  }

  if (erreur || !candidat) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{erreur || "Candidat introuvable."}</p>

          <Link
            to="/"
            replace
            className="mt-4 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Retour aux candidatures
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* RETOUR */}

        <Link
          to="/"
          replace
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          ← Retour aux candidatures
        </Link>

        {/* EN-TÊTE */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {candidat.nom}
              </h1>

              <p className="mt-1 text-slate-500">{candidat.email}</p>

              <p className="mt-3 text-sm text-slate-600">
                {candidat.domaine} · {candidat.niveau}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-4xl font-bold text-blue-600">
                {candidat.score}/100
              </p>

              <p className="mt-1 font-medium text-slate-600">
                {candidat.qualification}
              </p>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Suivi de la candidature
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Modifiez le statut pour suivre l’avancement du recrutement.
              </p>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              Statut
              <select
                value={candidat.statut}
                onChange={(event) => {
                  const statut = event.target.value;
                  if (estStatutCandidat(statut)) {
                    void changerStatut(statut);
                  }
                }}
                disabled={miseAJourStatut}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-wait disabled:opacity-60"
              >
                {STATUTS_CANDIDAT.map((statut) => (
                  <option key={statut} value={statut}>
                    {statut}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {miseAJourStatut && (
            <p className="mt-3 text-sm text-slate-500" role="status">
              Mise à jour...
            </p>
          )}
          {erreurStatut && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {erreurStatut}
            </p>
          )}
        </section>

        {/* INFORMATIONS */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Informations</h2>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Email</p>

              <p className="mt-1 font-medium text-slate-900">
                {candidat.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Téléphone</p>

              <p className="mt-1 font-medium text-slate-900">
                {candidat.telephone}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Domaine</p>

              <p className="mt-1 font-medium text-slate-900">
                {candidat.domaine}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Niveau</p>

              <p className="mt-1 font-medium text-slate-900">
                {candidat.niveau}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Expérience</p>

              <p className="mt-1 font-medium text-slate-900">
                {candidat.experience} an
                {candidat.experience > 1 ? "s" : ""}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Disponibilité</p>

              <p className="mt-1 font-medium text-slate-900">
                {candidat.disponibilite}
              </p>
            </div>
          </div>
        </section>

        {/* COMPÉTENCES */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Compétences</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {candidat.competences.map((competence) => (
              <span
                key={competence}
                className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
              >
                {competence}
              </span>
            ))}
          </div>
        </section>

        {/* LIENS */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Liens et projets
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {candidat.portfolio && (
              <a
                href={candidat.portfolio}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
              >
                <p className="text-sm text-slate-500">Portfolio</p>

                <p className="mt-1 font-medium text-blue-600">
                  Voir le portfolio →
                </p>
              </a>
            )}

            {candidat.github && (
              <a
                href={candidat.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
              >
                <p className="text-sm text-slate-500">GitHub</p>

                <p className="mt-1 font-medium text-blue-600">Voir GitHub →</p>
              </a>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {candidat.projet1 && (
              <a
                href={candidat.projet1}
                target="_blank"
                rel="noreferrer"
                className="block text-blue-600 hover:underline"
              >
                Projet 1 →
              </a>
            )}

            {candidat.projet2 && (
              <a
                href={candidat.projet2}
                target="_blank"
                rel="noreferrer"
                className="block text-blue-600 hover:underline"
              >
                Projet 2 →
              </a>
            )}

            {candidat.projet3 && (
              <a
                href={candidat.projet3}
                target="_blank"
                rel="noreferrer"
                className="block text-blue-600 hover:underline"
              >
                Projet 3 →
              </a>
            )}
          </div>
        </section>

        {/* MOTIVATION */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Motivation</h2>

          <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
            {candidat.motivation}
          </p>
        </section>

        {/* CV */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">CV</h2>

          <a
            href={candidat.cv_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Voir le CV →
          </a>
        </section>
      </div>
    </main>
  );
}

export default CandidatDetail;
