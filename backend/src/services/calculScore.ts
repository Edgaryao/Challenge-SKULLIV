import type { CandidatureInput } from "../types/candidat";

/**
 * Points maximum par critère
 *
 * Compétences   : 30
 * Expérience    : 15
 * Motivation    : 15
 * Disponibilité : 10
 * Niveau        : 10
 * Projets       : 10
 * Portfolio     : 5
 * GitHub        : 5
 *
 * TOTAL          : 100
 */

const POIDS_COMPETENCES: Record<string, number> = {
  HTML: 3,
  CSS: 3,
  JavaScript: 6,
  TypeScript: 5,
  React: 5,
  "Vue.js": 4,
  Angular: 4,
  "Next.js": 5,
  "Node.js": 4,
  Express: 3,
  NestJS: 4,
  Python: 5,
  Django: 4,
  PHP: 4,
  Laravel: 4,
  Java: 4,
  "Spring Boot": 5,
  "C#": 4,
  ".NET": 4,
  SQL: 4,
  MySQL: 3,
  PostgreSQL: 3,
  MongoDB: 3,
  Git: 2,
  Docker: 3,
  AWS: 3,
  Figma: 2,
  Flutter: 5,
  "React Native": 5,
};

/**
 * Calcule le score des compétences.
 * Maximum : 30 points.
 */
function calculerScoreCompetences(competences: string[]): number {
  let score = 0;

  for (const competence of competences) {
    score += POIDS_COMPETENCES[competence] ?? 0;
  }

  return Math.min(score, 30);
}

/**
 * Calcule le score de l'expérience.
 * Maximum : 15 points.
 */
function calculerScoreExperience(experience: number): number {
  if (experience <= 0) {
    return 0;
  }

  if (experience < 1) {
    return 5;
  }

  if (experience < 2) {
    return 8;
  }

  if (experience < 3) {
    return 10;
  }

  if (experience < 5) {
    return 12;
  }

  return 15;
}

/**
 * Calcule le score de la motivation.
 * Maximum : 15 points.
 */
function calculerScoreMotivation(motivation: string): number {
  const longueur = motivation.trim().length;

  if (longueur >= 250) {
    return 15;
  }

  if (longueur >= 100) {
    return 10;
  }

  if (longueur > 0) {
    return 5;
  }

  return 0;
}

/**
 * Calcule le score de disponibilité.
 * Maximum : 10 points.
 */
function calculerScoreDisponibilite(disponibilite: string): number {
  switch (disponibilite) {
    case "immediate":
      return 10;

    case "1-mois":
      return 7;

    case "2-mois":
      return 4;

    default:
      return 0;
  }
}

/**
 * Calcule le score du niveau.
 * Maximum : 10 points.
 */
function calculerScoreNiveau(niveau: string): number {
  switch (niveau) {
    case "avance":
      return 10;

    case "intermediaire":
      return 7;

    case "debutant":
      return 4;

    default:
      return 0;
  }
}

/**
 * Calcule le score des projets.
 * Maximum : 10 points.
 */
function calculerScoreProjets(candidat: CandidatureInput): number {
  let score = 0;

  if (candidat.projet1.trim()) {
    score += 3;
  }

  if (candidat.projet2.trim()) {
    score += 4;
  }

  if (candidat.projet3.trim()) {
    score += 3;
  }

  return Math.min(score, 10);
}

/**
 * Calcule le score du portfolio.
 * Maximum : 5 points.
 */
function calculerScorePortfolio(portfolio: string): number {
  return portfolio.trim() ? 5 : 0;
}

/**
 * Calcule le score GitHub.
 * Maximum : 5 points.
 */
function calculerScoreGithub(github: string): number {
  return github.trim() ? 5 : 0;
}

/**
 * Calcule le score global du candidat.
 * Maximum absolu : 100 points.
 */
export function calculerScore(candidat: CandidatureInput): number {
  const scoreCompetences = calculerScoreCompetences(candidat.competences);

  const scoreExperience = calculerScoreExperience(candidat.experience);

  const scoreMotivation = calculerScoreMotivation(candidat.motivation);

  const scoreDisponibilite = calculerScoreDisponibilite(candidat.disponibilite);

  const scoreNiveau = calculerScoreNiveau(candidat.niveau);

  const scoreProjets = calculerScoreProjets(candidat);

  const scorePortfolio = calculerScorePortfolio(candidat.portfolio);

  const scoreGithub = calculerScoreGithub(candidat.github);

  const score =
    scoreCompetences +
    scoreExperience +
    scoreMotivation +
    scoreDisponibilite +
    scoreNiveau +
    scoreProjets +
    scorePortfolio +
    scoreGithub;

  // Sécurité : le score ne peut jamais dépasser 100.
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Détermine la priorité du candidat
 * en fonction de son score.
 */
export function qualifierCandidat(score: number): string {
  if (score >= 80) {
    return "Prioritaire";
  }

  if (score >= 60) {
    return "Secondaire";
  }

  if (score >= 40) {
    return "À étudier";
  }

  return "Faible priorité";
}
