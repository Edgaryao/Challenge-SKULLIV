import express from "express";
import "./database/database";
import {
  creerCandidat,
  recupererCandidats,
  recupererCandidat,
  modifierFavori,
  modifierStatut,
} from "./controllers/candidat.controller";
import cors from "cors";
import db from "./database/database";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins = [
  "https://skullvi-candidat.vercel.app",
  "https://challenge-skulliv.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Talent Engine API fonctionne !",
  });
});


// Récupérer les candidats enregistrés dans la base de données
app.post("/candidats", creerCandidat);
app.get("/candidats", recupererCandidats);
// recuperer un candidat les details d'un candidat
app.get("/candidats/:id", recupererCandidat);
app.patch("/candidats/:id/favori", modifierFavori);
app.patch("/candidats/:id/statut", modifierStatut);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

app.get("/test-db", async (req, res) => {
  try {
    const resultat = await db.query("SELECT NOW() AS heure");

    res.json({
      message: "Connexion à Supabase réussie",
      heure: resultat.rows[0].heure,
    });
  } catch (erreur) {
    console.error("Erreur de connexion Supabase :", erreur);

    res.status(500).json({
      message: "Connexion à Supabase échouée",
    });
  }
});
