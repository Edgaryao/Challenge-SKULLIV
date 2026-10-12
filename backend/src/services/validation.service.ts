import type { CandidatureInput } from "../types/candidat";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEPHONE_REGEX = /^(?:\+225)?(0[157]\d{8})$/;
const URL_REGEX = /^https?:\/\/.+\..+/;

export function validerCandidat(candidat: CandidatureInput): string[] {
  const erreurs: string[] = [];

  // Nom
  if (!candidat.nom?.trim()) {
    erreurs.push("Le nom est obligatoire.");
  }

  // Email
  if (!candidat.email?.trim()) {
    erreurs.push("L'email est obligatoire.");
  } else if (!EMAIL_REGEX.test(candidat.email.trim())) {
    erreurs.push("L'email est invalide.");
  }

  // Téléphone
  const telephone = candidat.telephone?.replace(/\s/g, "");

  if (!telephone) {
    erreurs.push("Le téléphone est obligatoire.");
  } else if (!TELEPHONE_REGEX.test(telephone)) {
    erreurs.push("Le numéro de téléphone est invalide.");
  }

  // Domaine
  if (!candidat.domaine?.trim()) {
    erreurs.push("Le domaine est obligatoire.");
  }

  // Niveau
  if (!candidat.niveau?.trim()) {
    erreurs.push("Le niveau est obligatoire.");
  }

  // Compétences
  if (
    !Array.isArray(candidat.competences) ||
    candidat.competences.length === 0
  ) {
    erreurs.push("Au moins une compétence est obligatoire.");
  }

  // Expérience
  if (
    typeof candidat.experience !== "number" ||
    candidat.experience < 0
  ) {
    erreurs.push("L'expérience doit être un nombre positif ou nul.");
  }

  // CV
  if (!candidat.cv_url?.trim()) {
    erreurs.push("Le CV est obligatoire.");
  } else if (!URL_REGEX.test(candidat.cv_url.trim())) {
    erreurs.push("L'URL du CV est invalide.");
  }

  // Disponibilité
  if (!candidat.disponibilite?.trim()) {
    erreurs.push("La disponibilité est obligatoire.");
  }

  // Motivation
  if (!candidat.motivation?.trim()) {
    erreurs.push("La motivation est obligatoire.");
  }

  // Portfolio facultatif
  if (
    candidat.portfolio?.trim() &&
    !URL_REGEX.test(candidat.portfolio.trim())
  ) {
    erreurs.push("L'URL du portfolio est invalide.");
  }

  // GitHub facultatif
  if (
    candidat.github?.trim() &&
    !URL_REGEX.test(candidat.github.trim())
  ) {
    erreurs.push("L'URL GitHub est invalide.");
  }

  // Projets facultatifs
  const projets = [
    candidat.projet1,
    candidat.projet2,
    candidat.projet3,
  ];

  projets.forEach((projet, index) => {
    if (projet?.trim() && !URL_REGEX.test(projet.trim())) {
      erreurs.push(`L'URL du projet ${index + 1} est invalide.`);
    }
  });

  return erreurs;
}