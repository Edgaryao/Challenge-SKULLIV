import { COMPETENCES_WEB } from "../types/competence";
import { useRef, useState } from "react";
import type { Candidat } from "../types/candidats";
import { envoyerCandidature as envoyerCandidatureAPI } from "../services/candidats.services";
import Modal from "./Modal";

function RequiredLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-slate-700 mb-2"
    >
      {children}
      <span className="ml-1 text-red-500" aria-hidden="true">
        *
      </span>
    </label>
  );
}

function CandidatureForm() {
  const soumissionEnCours = useRef(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  // usetate qui gère le modal
  const [modal, setModal] = useState({
    ouvert: false,
    titre: "",
    message: "",
  });

  // regex EMAIL_REGEX, numero telephone ,lien url
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const TELEPHONE_REGEX = /^[0-9\s+()-]{8,20}$/;
  const URL_REGEX = /^https?:\/\/.+\..+/;

  // fonction pour afficher une erreur dans le modal
  const afficherErreur = (message: string) => {
    setModal({
      ouvert: true,
      titre: "Vérification du formulaire",
      message,
    });
  };
  // usestate qui gere les saisie du formulaire de candidature
  const [candidat, setCandidat] = useState<Candidat>({
    nom: "",
    email: "",
    telephone: "",
    domaine: "",
    niveau: "",
    competences: [],
    experience: 0,
    portfolio: "",
    github: "",

    projet1: "",
    projet2: "",
    projet3: "",
    cv_url: "",
    disponibilite: "",
    motivation: "",
  });

  //   fonction de soummission du formulaire
  const envoyerCandidature = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (soumissionEnCours.current) {
      return;
    }

    if (!candidat.nom.trim()) {
      afficherErreur("Nom requis. Veuillez renseigner votre nom complet.");
      return;
    }

    if (!candidat.email.trim()) {
      afficherErreur("Email requis. Veuillez renseigner votre adresse email.");
      return;
    }

    if (!EMAIL_REGEX.test(candidat.email.trim())) {
      afficherErreur("Email invalide. Exemple attendu : nom@gmail.com.");
      return;
    }

    if (!candidat.telephone.trim()) {
      afficherErreur(
        "Numéro de téléphone requis. Veuillez renseigner votre numéro.",
      );
      return;
    }
    if (!candidat.cv_url.trim()) {
      afficherErreur("CV requis. Veuillez renseigner le lien vers votre CV.");
      return;
    }

    if (!URL_REGEX.test(candidat.cv_url.trim())) {
      afficherErreur(
        "Lien du CV invalide. Le lien doit commencer par http:// ou https://. Exemple : https://drive.google.com/...",
      );
      return;
    }

    if (!TELEPHONE_REGEX.test(candidat.telephone.replace(/\s/g, ""))) {
      afficherErreur(
        "Numéro de téléphone invalide. Il doit contenir exactement 10 chiffres. Exemple : 0700000000 ou +2250700000000.",
      );
      return;
    }

    if (!candidat.domaine) {
      afficherErreur("Domaine requis. Veuillez sélectionner votre domaine.");
      return;
    }

    if (!candidat.niveau) {
      afficherErreur("Niveau requis. Veuillez sélectionner votre niveau.");
      return;
    }

    if (candidat.competences.length === 0) {
      afficherErreur(
        "Compétence requise. Sélectionnez au moins une compétence.",
      );
      return;
    }

    if (candidat.experience < 0) {
      afficherErreur(
        "Expérience invalide. Le nombre d'années ne peut pas être négatif.",
      );
      return;
    }

    if (!candidat.disponibilite) {
      afficherErreur(
        "Disponibilité requise. Veuillez indiquer quand vous pouvez commencer.",
      );
      return;
    }

    if (!candidat.motivation.trim()) {
      afficherErreur(
        "Motivation requise. Expliquez brièvement pourquoi vous souhaitez rejoindre l'équipe.",
      );
      return;
    }

    if (
      candidat.portfolio.trim() &&
      !URL_REGEX.test(candidat.portfolio.trim())
    ) {
      afficherErreur(
        "Lien portfolio invalide. Le lien doit commencer par http:// ou https://. Exemple : https://monportfolio.com.",
      );
      return;
    }

    if (candidat.github.trim() && !URL_REGEX.test(candidat.github.trim())) {
      afficherErreur(
        "Lien GitHub invalide. Le lien doit commencer par https://. Exemple : https://github.com/monprofil.",
      );
      return;
    }

    if (candidat.projet1.trim() && !URL_REGEX.test(candidat.projet1.trim())) {
      afficherErreur(
        "Lien du projet 1 invalide. Utilisez un lien commençant par http:// ou https://. Exemple : https://github.com/monprofil/projet.",
      );
      return;
    }

    if (candidat.projet2.trim() && !URL_REGEX.test(candidat.projet2.trim())) {
      afficherErreur(
        "Lien du projet 2 invalide. Utilisez un lien commençant par http:// ou https://. Exemple : https://github.com/monprofil/projet.",
      );
      return;
    }

    if (candidat.projet3.trim() && !URL_REGEX.test(candidat.projet3.trim())) {
      afficherErreur(
        "Lien du projet 3 invalide. Utilisez un lien commençant par http:// ou https://. Exemple : https://github.com/monprofil/projet.",
      );
      return;
    }

    try {
      soumissionEnCours.current = true;
      setEnvoiEnCours(true);
      await envoyerCandidatureAPI(candidat);

      setModal({
        ouvert: true,
        titre: "Candidature envoyée",
        message: "Votre candidature a bien été enregistrée.",
      });
      setCandidat({
        nom: "",
        email: "",
        telephone: "",
        domaine: "",
        niveau: "",
        competences: [],
        experience: 0,
        portfolio: "",
        github: "",

        projet1: "",
        projet2: "",
        projet3: "",
        cv_url: "",

        disponibilite: "",
        motivation: "",
      });
    } catch (error) {
      setModal({
        ouvert: true,
        titre: "Erreur",
        message:
          error instanceof Error
            ? error.message
            : "Impossible d'envoyer la candidature. Veuillez ressayer à nouveau",
      });
    } finally {
      soumissionEnCours.current = false;
      setEnvoiEnCours(false);
    }
  };
  return (
    <main className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-12">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
          Talent Engine
        </p>

        <h1 className="mt-3 text-4xl font-bold text-slate-900">
          Déposez votre candidature
        </h1>

        <p className="mt-3 text-slate-500 max-w-2xl">
          Quelques informations suffisent pour nous permettre de comprendre
          votre profil et d'évaluer vos compétences.
        </p>
      </div>

      <form className="space-y-10" onSubmit={envoyerCandidature}>
        {/* Informations personnelles */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Informations personnelles
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-6">
            Vos coordonnées pour pouvoir vous contacter.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <RequiredLabel htmlFor="nom">Nom complet</RequiredLabel>

              <input
                id="nom"
                autoComplete="name"
                type="text"
                value={candidat.nom}
                onChange={(e) =>
                  setCandidat({ ...candidat, nom: e.target.value })
                }
                placeholder="Ex : Yao Edgar"
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600 transition"
              />
            </div>

            <div>
              <RequiredLabel htmlFor="email">Adresse email</RequiredLabel>

              <input
                id="email"
                autoComplete="email"
                type="email"
                value={candidat.email}
                onChange={(e) =>
                  setCandidat({ ...candidat, email: e.target.value })
                }
                placeholder="Ex : edgar@email.com"
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600 transition"
              />
            </div>

            <div>
              <RequiredLabel htmlFor="telephone">Téléphone</RequiredLabel>

              <input
                id="telephone"
                autoComplete="tel"
                type="tel"
                value={candidat.telephone}
                onChange={(e) =>
                  setCandidat({ ...candidat, telephone: e.target.value })
                }
                placeholder="Ex : 07 00 00 00 00"
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>
        </section>

        {/* Profil */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Votre profil</h2>

          <p className="text-sm text-slate-500 mt-1 mb-6">
            Présentez votre parcours et vos compétences.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <RequiredLabel htmlFor="domaine">Domaine</RequiredLabel>

              <select
                id="domaine"
                autoComplete="off"
                value={candidat.domaine}
                onChange={(e) =>
                  setCandidat({ ...candidat, domaine: e.target.value })
                }
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600"
              >
                <option value="">Sélectionner un domaine</option>

                <option value="developpement-web">Développement Web</option>
              </select>
            </div>

            <div>
              <RequiredLabel htmlFor="niveau">Niveau</RequiredLabel>

              <select
                id="niveau"
                autoComplete="off"
                value={candidat.niveau}
                onChange={(e) =>
                  setCandidat({ ...candidat, niveau: e.target.value })
                }
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600"
              >
                <option value="">Sélectionner votre niveau</option>

                <option value="debutant">Débutant</option>

                <option value="intermediaire">Intermédiaire</option>

                <option value="avance">Avancé</option>
              </select>
            </div>
          </div>
        </section>

        {/* Compétences */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Compétences
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-6">
            Sélectionnez les technologies que vous maîtrisez.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {COMPETENCES_WEB.map((competence) => (
              <label
                key={competence}
                className="flex items-center gap-3 border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <input
                  type="checkbox"
                  autoComplete="off"
                  value={competence}
                  checked={candidat.competences.includes(competence)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCandidat({
                        ...candidat,
                        competences: [...candidat.competences, competence],
                      });
                    } else {
                      setCandidat({
                        ...candidat,
                        competences: candidat.competences.filter(
                          (c) => c !== competence,
                        ),
                      });
                    }
                  }}
                  className="accent-blue-600"
                />

                <span className="text-sm">{competence}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Expérience */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Expérience</h2>

          <div className="mt-6">
            <RequiredLabel htmlFor="experience">
              Années d'expérience
            </RequiredLabel>

            <input
              id="experience"
              autoComplete="off"
              type="number"
              min="0"
              value={candidat.experience}
              onChange={(e) =>
                setCandidat({
                  ...candidat,
                  experience: parseInt(e.target.value) || 0,
                })
              }
              placeholder="Ex : 2"
              className="w-full md:w-1/2 border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600"
            />
          </div>
        </section>

        {/* Liens */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Vos projets</h2>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label
                htmlFor="portfolio"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Portfolio
              </label>

              <input
                id="portfolio"
                autoComplete="url"
                type="url"
                value={candidat.portfolio}
                onChange={(e) =>
                  setCandidat({ ...candidat, portfolio: e.target.value })
                }
                placeholder="https://monportfolio.com"
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="github"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                GitHub
              </label>

              <input
                id="github"
                autoComplete="url"
                type="url"
                value={candidat.github}
                onChange={(e) =>
                  setCandidat({ ...candidat, github: e.target.value })
                }
                placeholder="https://github.com/..."
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="projet1"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Lien du projet 1
              </label>

              <input
                id="projet1"
                autoComplete="off"
                type="url"
                value={candidat.projet1}
                onChange={(e) =>
                  setCandidat({ ...candidat, projet1: e.target.value })
                }
                placeholder="https://..."
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="projet2"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Lien du projet 2
              </label>

              <input
                id="projet2"
                autoComplete="off"
                type="url"
                value={candidat.projet2}
                onChange={(e) =>
                  setCandidat({ ...candidat, projet2: e.target.value })
                }
                placeholder="https://..."
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="projet3"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Lien du projet 3
              </label>

              <input
                id="projet3"
                autoComplete="off"
                type="url"
                value={candidat.projet3}
                onChange={(e) =>
                  setCandidat({ ...candidat, projet3: e.target.value })
                }
                placeholder="https://..."
                className="w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </section>
        {/* cv  */}
        <div>
          <RequiredLabel htmlFor="cv_url">URL du CV</RequiredLabel>

          <input
            id="cv_url"
            type="url"
            placeholder="https://drive.google.com/..."
            value={candidat.cv_url}
            onChange={(e) =>
              setCandidat({
                ...candidat,
                cv_url: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <p className="mt-1 text-sm text-slate-500">
            Ajoutez un lien accessible vers votre CV au format PDF.
          </p>
        </div>
        {/* Disponibilité */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">
            Disponibilité
          </h2>

          <div className="mt-6">
            <RequiredLabel htmlFor="disponibilite">
              Quand pouvez-vous commencer ?
            </RequiredLabel>

            <select
              id="disponibilite"
              autoComplete="off"
              value={candidat.disponibilite}
              onChange={(e) =>
                setCandidat({ ...candidat, disponibilite: e.target.value })
              }
              className="w-full md:w-1/2 border-0 border-b-2 border-slate-200 bg-transparent px-0 py-3 outline-none focus:border-blue-600"
            >
              <option value="">Sélectionner une disponibilité</option>

              <option value="immediate">Immédiatement</option>

              <option value="moins-1-mois">Dans moins d'un mois</option>

              <option value="plus-1-mois">Dans plus d'un mois</option>
            </select>
          </div>
        </section>

        {/* Motivation */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Motivation</h2>

          <p className="text-sm text-slate-500 mt-1 mb-6">
            Pourquoi souhaitez-vous rejoindre ce programme ?
          </p>

          <RequiredLabel htmlFor="motivation">Votre motivation</RequiredLabel>

          <textarea
            id="motivation"
            autoComplete="off"
            rows={6}
            value={candidat.motivation}
            onChange={(e) =>
              setCandidat({ ...candidat, motivation: e.target.value })
            }
            placeholder="Présentez votre motivation..."
            className="w-full border border-slate-200 rounded-xl bg-white px-4 py-3 outline-none focus:border-blue-600 resize-none transition"
          />
        </section>

        {/* Bouton */}
        <div className="pt-4 pb-10">
          <button
            type="submit"
            disabled={envoiEnCours}
            aria-busy={envoiEnCours}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {envoiEnCours ? "Envoi en cours..." : "Envoyer ma candidature"}
          </button>
        </div>
      </form>
      {modal.ouvert && (
        <Modal
          titre={modal.titre}
          message={modal.message}
          onFermer={() =>
            setModal({
              ouvert: false,
              titre: "",
              message: "",
            })
          }
        />
      )}
    </main>
  );
}

export default CandidatureForm;
