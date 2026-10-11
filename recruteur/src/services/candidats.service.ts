import type {
  Candidat,
  CandidatDetail,
  StatutCandidat,
} from "../types/candidat";

const API_URL = "http://localhost:3000";

export async function requeteApi(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Impossible de contacter le serveur. Vérifiez que le serveur est démarré puis réessayez.",
        { cause: error },
      );
    }

    throw error;
  }
}

export async function recupererCandidats(): Promise<Candidat[]> {
  const response = await requeteApi(`${API_URL}/candidats`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les candidats.");
  }

  const data: Array<Omit<Candidat, "favori"> & { favori: boolean | number }> =
    await response.json();

  return data.map((candidat) => ({
    ...candidat,
    favori: Boolean(candidat.favori),
  }));
}

export async function recupererCandidat(id: number): Promise<CandidatDetail> {
  const response = await requeteApi(`${API_URL}/candidats/${id}`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer le profil du candidat.");
  }

  const data = await response.json();

  return data;
}

export async function modifierFavori(
  id: number,
): Promise<{ message: string; favori: boolean }> {
  const response = await requeteApi(`${API_URL}/candidats/${id}/favori`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Impossible de modifier le favori.");
  }

  return response.json();
}

export async function modifierStatut(
  id: number,
  statut: StatutCandidat,
): Promise<{ message: string; statut: StatutCandidat }> {
  const response = await requeteApi(`${API_URL}/candidats/${id}/statut`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      statut,
    }),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new Error(data.message || "Impossible de modifier le statut.");
  }

  return response.json();
}