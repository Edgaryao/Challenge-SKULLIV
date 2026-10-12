# Talent Engine — Mini-Challenge SKULLVI

## Présentation

Talent Engine est une application de recrutement permettant de centraliser les candidatures, de valider les informations saisies, d'évaluer automatiquement les profils et d'aider un recruteur à identifier les candidats prioritaires.

L'objectif est de transformer un processus de sélection manuel en un processus plus structuré, rapide et fiable.

## Fonctionnalités principales

- Formulaire de candidature
- Validation des données côté frontend et backend
- Détection des candidatures avec une adresse email déjà utilisée
- Calcul automatique d'un score sur 100
- Qualification automatique des candidats
- Classement des candidats par score
- Recherche de candidats
- Filtres par niveau de qualification
- Gestion des favoris
- Gestion du statut de candidature
- Consultation du profil détaillé d'un candidat
- Gestion des erreurs réseau
- Stockage persistant des candidatures dans PostgreSQL via Supabase

## Architecture

Le projet est composé de trois applications distinctes.

```text
TestRecrutement/
│
├── candidat/       # interface de candidature
├── recruteur/      # interface de gestion des candidatures
├── backend/        # API REST et logique métier
└── README.md
```

### Communication entre les applications

```text
┌──────────────────┐
│ Interface        │
│ Candidat         │
└────────┬─────────┘
         │ POST /candidats
         ▼
┌──────────────────┐
│ Backend          │
│ Node.js / Express│
└────────┬─────────┘
         │ Requêtes SQL
         ▼
┌──────────────────┐
│ PostgreSQL       │
│ Supabase         │
└────────▲─────────┘
         │
┌────────┴─────────┐
│ Backend          │
│ GET /candidats   │
│ PATCH /...       │
└────────▲─────────┘
         │
┌──────────────────┐
│ Interface        │
│ Recruteur        │
└──────────────────┘
```

Les interfaces frontend communiquent avec l'API REST. Le backend gère la validation, le calcul des scores et les opérations en base de données. PostgreSQL, hébergé par Supabase, conserve les candidatures.

## Technologies utilisées

### Frontend candidat

- React
- TypeScript
- Vite
- Tailwind CSS

### Frontend recruteur

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript
- `pg` pour la connexion PostgreSQL
- `dotenv` pour la configuration des variables d'environnement

### Base de données

- PostgreSQL
- Supabase
- Connexion PostgreSQL via le pool de connexions `pg`

## Fonctionnement

### 1. Candidature

Le candidat renseigne :

- ses informations personnelles ;
- son domaine ;
- son niveau ;
- ses compétences ;
- son expérience ;
- sa disponibilité ;
- sa motivation ;
- son CV ;
- ses éventuels projets ;
- son portfolio ;
- son profil GitHub.

Les champs obligatoires sont contrôlés avant l'envoi.

### 2. Validation

Les données sont validées côté frontend afin de fournir un retour immédiat à l'utilisateur.

Elles sont également validées côté backend afin de garantir l'intégrité des données, y compris lorsqu'une requête est envoyée directement à l'API.

Les contrôles comprennent notamment :

- champs obligatoires ;
- format de l'email ;
- format du téléphone ;
- présence d'au moins une compétence ;
- expérience positive ou nulle ;
- format des URLs ;
- présence du CV ;
- disponibilité ;
- motivation ;
- détection des emails déjà enregistrés.

### 3. Évaluation

Après validation, le backend calcule automatiquement le score du candidat selon des règles déterministes.

### 4. Qualification

Le score obtenu détermine automatiquement la priorité du candidat.

### 5. Suivi recruteur

Le recruteur peut :

- rechercher un candidat ;
- filtrer les profils ;
- consulter le détail d'un candidat ;
- ajouter ou retirer un favori ;
- modifier le statut de candidature ;
- actualiser les données.

## Système de scoring

Le score est compris entre 0 et 100 points.

| Critère | Score maximum |
|---|---:|
| Compétences | 30 |
| Expérience | 15 |
| Motivation | 15 |
| Disponibilité | 10 |
| Niveau | 10 |
| Projets | 10 |
| Portfolio | 5 |
| GitHub | 5 |
| **Total** | **100** |

### Compétences

Chaque compétence possède un poids différent en