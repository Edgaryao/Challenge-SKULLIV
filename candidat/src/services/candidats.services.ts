import type { Candidat } from "../types/candidats";

const API_URL = "http://localhost:3000";

export async function envoyerCandidature(candidat: Candidat) {
  const response = await fetch(`${API_URL}/candidats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(candidat),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Une erreur est survenue");
  }

  return data;
}
