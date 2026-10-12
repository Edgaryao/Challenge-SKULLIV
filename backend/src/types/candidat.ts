export type StatutCandidat =
  | "À traiter"
  | "À contacter"
  | "Entretien"
  | "Retenu"
  | "Refusé";

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
  favori: number;
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

export type CandidatureInput = Omit<CandidatDetail, keyof Candidat> &
  Pick<
    Candidat,
    "nom" | "email" | "domaine" | "niveau" | "experience" | "disponibilite"
  >;
