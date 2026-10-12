import { Request, Response } from "express";
import { calculerScore, qualifierCandidat } from "../services/calculScore";
import { validerCandidat } from "../services/validation.service";
import type { CandidatureInput } from "../types/candidat";
import db from "../database/database";

export async function creerCandidat(req: Request, res: Response) {
  try {
    const candidat: CandidatureInput = req.body;

    const erreur = validerCandidat(candidat);

    if (erreur.length > 0) {
      return res.status(400).json({
        message: erreur.join(" "),
      });
    }

    const candidatExistant = await db.query(
      "SELECT id FROM candidats WHERE email = $1",
      [candidat.email],
    );

    if (candidatExistant.rows.length > 0) {
      return res.status(409).json({
        message: "Cette adresse email a déjà été utilisée pour une candidature",
      });
    }

    const score = calculerScore(candidat);
    const qualification = qualifierCandidat(score);

    const resultat = await db.query(
      `
      INSERT INTO candidats (
        nom,
        email,
        telephone,
        domaine,
        niveau,
        competences,
        experience,
        portfolio,
        github,
        projet1,
        projet2,
        projet3,
        cv_url,
        disponibilite,
        motivation,
        score,
        qualification
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17
      )
      RETURNING id
      `,
      [
        candidat.nom,
        candidat.email,
        candidat.telephone,
        candidat.domaine,
        candidat.niveau,
        JSON.stringify(candidat.competences),
        candidat.experience,
        candidat.portfolio || null,
        candidat.github || null,
        candidat.projet1 || null,
        candidat.projet2 || null,
        candidat.projet3 || null,
        candidat.cv_url,
        candidat.disponibilite,
        candidat.motivation,
        score,
        qualification,
      ],
    );

    return res.status(201).json({
      message: "Candidature reçue",
      candidatId: resultat.rows[0].id,
    });
  } catch (erreur: any) {
    if (erreur.code === "23505") {
      return res.status(409).json({
        message: "Cette adresse email a déjà été utilisée pour une candidature",
      });
    }

    console.error("Erreur création candidat :", erreur);

    return res.status(500).json({
      message: "Erreur lors de la création de la candidature",
    });
  }
}

export async function recupererCandidats(req: Request, res: Response) {
  try {
    const resultat = await db.query(
      "SELECT * FROM candidats ORDER BY created_at DESC",
    );

    const candidats = resultat.rows.map((candidat) => ({
      ...candidat,
      competences:
        typeof candidat.competences === "string"
          ? JSON.parse(candidat.competences)
          : candidat.competences,
    }));

    return res.json(candidats);
  } catch (erreur) {
    console.error("Erreur récupération candidats :", erreur);

    return res.status(500).json({
      message: "Erreur lors de la récupération des candidats",
    });
  }
}

export async function recupererCandidat(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "L'identifiant du candidat est invalide",
    });
  }

  try {
    const resultat = await db.query("SELECT * FROM candidats WHERE id = $1", [
      id,
    ]);

    if (resultat.rows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable",
      });
    }

    const candidat = resultat.rows[0];

    return res.json({
      ...candidat,
      competences:
        typeof candidat.competences === "string"
          ? JSON.parse(candidat.competences)
          : candidat.competences,
    });
  } catch (erreur) {
    console.error("Erreur récupération candidat :", erreur);

    return res.status(500).json({
      message: "Erreur lors de la récupération du candidat",
    });
  }
}

export async function modifierFavori(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "L'identifiant du candidat est invalide",
    });
  }

  try {
    const resultat = await db.query(
      `
      UPDATE candidats
      SET favori = NOT favori
      WHERE id = $1
      RETURNING id, favori
      `,
      [id],
    );

    if (resultat.rows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable",
      });
    }

    const favori = resultat.rows[0].favori;

    return res.json({
      message: favori
        ? "Candidat ajouté aux favoris"
        : "Candidat retiré des favoris",
      favori,
    });
  } catch (erreur) {
    console.error("Erreur modification favori :", erreur);

    return res.status(500).json({
      message: "Erreur lors de la modification du favori",
    });
  }
}

export async function modifierStatut(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "L'identifiant du candidat est invalide",
    });
  }

  const statutsAutorises = [
    "À traiter",
    "À contacter",
    "Entretien",
    "Retenu",
    "Refusé",
  ];

  const { statut } = req.body;

  if (!statutsAutorises.includes(statut)) {
    return res.status(400).json({
      message: "Le statut fourni est invalide.",
    });
  }

  try {
    const resultat = await db.query(
      `
      UPDATE candidats
      SET statut = $1
      WHERE id = $2
      RETURNING id
      `,
      [statut, id],
    );

    if (resultat.rows.length === 0) {
      return res.status(404).json({
        message: "Candidat introuvable",
      });
    }

    return res.json({
      message: "Statut du candidat modifié.",
      statut,
    });
  } catch (erreur) {
    console.error("Erreur modification statut :", erreur);

    return res.status(500).json({
      message: "Erreur lors de la modification du statut",
    });
  }
}
