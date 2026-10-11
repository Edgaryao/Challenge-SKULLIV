export const STATUTS_CANDIDAT = [
  "À traiter",
  "À contacter",
  "Entretien",
  "Retenu",
  "Refusé",
] as const;

export type StatutCandidat = (typeof STATUTS_CANDIDAT)[number];

export function estStatutCandidat(statut: string): statut is StatutCandidat {
  return STATUTS_CANDIDAT.some((statutAutorise) => statutAutorise === statut);
}

export type Candidat = {
  id: number;

  nom: string;
  email: string;
  domaine: string;
  niveau: string;
  experience: number;
  disponibilite: string;

  score: number;
  qualification: string;
  favori: boolean;
  statut: StatutCandidat;
  created_at: string;
};

export type CandidatDetail = Candidat & {
  telephone: string;
  competences: string[];
  portfolio: string;
  github: string;
  projet1: string;
  projet2: string;
  projet3: string;
  cv_url: string;
  motivation: string;
};
