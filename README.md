Talent Engine — Mini-Challenge SKULLVI

# Présentation

Talent Engine est une application de recrutement permettant de centraliser les candidatures, de valider les informations saisies, d'évaluer automatiquement les profils et d'aider un recruteur à identifier les candidats prioritaires.

L'objectif est de transformer un processus de sélection manuel en un processus plus structuré et plus rapide.

Fonctionnalités principales

- Formulaire de candidature
- Validation des données côté frontend et backend
- Détection des candidatures avec email déjà utilisé
- Calcul automatique d'un score sur 100
- Qualification automatique des candidats
- Classement des candidats par score
- Recherche de candidats
- Filtres par niveau de qualification
- Gestion des favoris
- Gestion du statut de candidature
- Consultation du profil détaillé d'un candidat
- Gestion des erreurs réseau
- Stockage local avec SQLite


# Architecture

Le projet est composé de trois applications distinctes :

TestRecrutement/
│
├── candidat/       → Interface de candidature
├── recruteur/      → Interface de gestion des candidatures
├── backend/        → API REST + logique métier + SQLite
└── README.md

# Communication

┌──────────────────┐
│  Interface       │
│  Candidat        │
└────────┬─────────┘
         │ POST /candidats
         ▼
┌──────────────────┐
│     Backend      │
│ Node.js/Express  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      SQLite      │
└────────┬─────────┘
         ▲
         │ GET /candidats
         │ PATCH /...
┌────────┴─────────┐
│  Interface       │
│  Recruteur       │
└──────────────────┘


# Technologies utilisées

# Frontend candidat

- React
- TypeScript
- Vite
- Tailwind CSS

# Frontend recruteur

- React
- TypeScript
- Vite
- Tailwind CSS

# Backend

- Node.js
- Express
- TypeScript

# Base de données

- SQLite
- better-sqlite3


# Fonctionnement

# 1. Candidature

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
- son GitHub.

Les champs obligatoires sont contrôlés avant l'envoi.

# 2. Validation

Les données sont validées côté frontend afin de fournir un retour immédiat à l'utilisateur.

Elles sont également validées côté backend afin de garantir l'intégrité des données même si une requête est envoyée directement à l'API.

Les contrôles comprennent notamment :

champs obligatoires ;

format de l'email ;

format du téléphone ;

présence d'au moins une compétence ;

expérience positive ou nulle ;

format des URLs ;

présence du CV ;

disponibilité ;

motivation.

3. Évaluation

Après validation, le backend calcule automatiquement le score du candidat.

4. Qualification

Le score obtenu détermine automatiquement la priorité du candidat.

5. Suivi recruteur

Le recruteur peut ensuite :

rechercher un candidat ;

filtrer les profils ;

consulter le détail d'un candidat ;

ajouter ou retirer un favori ;

modifier le statut de candidature ;

actualiser les données.

🧮 Système de scoring

Le score est compris entre 0 et 100 points.

Critère

Score maximum

Compétences

30

Expérience

15

Motivation

15

Disponibilité

10

Niveau

10

Projets

10

Portfolio

5

GitHub

5

Total

100

Compétences

Chaque compétence possède un poids différent en fonction de sa pertinence pour un profil technique.

Le score des compétences est limité à 30 points maximum.

Expérience

L'expérience est progressive :

Expérience

Points

0 an

0

Moins de 1 an

5

1 à moins de 2 ans

8

2 à moins de 3 ans

10

3 à moins de 5 ans

12

5 ans ou plus

15

Cette progression permet de valoriser l'expérience sans exclure automatiquement les profils juniors.

Motivation

La longueur de la motivation permet d'évaluer l'effort fourni dans la candidature :

moins de 100 caractères → 5 points

100 à 249 caractères → 10 points

250 caractères ou plus → 15 points

Disponibilité

Disponible immédiatement → 10 points

Disponible dans 1 mois → 7 points

Disponible dans 2 mois → 4 points

Niveau

Avancé → 10 points

Intermédiaire → 7 points

Débutant → 4 points

Projets

Les projets permettent de valoriser l'expérience pratique :

projet 1 → 3 points

projet 2 → 4 points

projet 3 → 3 points

Maximum : 10 points.

Portfolio et GitHub

Le portfolio et GitHub sont considérés comme des bonus :

Portfolio → +5 points

GitHub → +5 points

Ces éléments permettent de valoriser les profils qui fournissent des preuves concrètes de leur travail.

🎯 Qualification des candidats

Score

Qualification

80 – 100

🟢 Prioritaire

60 – 79

🔵 Secondaire

40 – 59

🟡 À étudier

0 – 39

🔴 Faible priorité

Cette qualification permet au recruteur d'identifier rapidement les profils nécessitant une attention particulière.

🗄️Base de données

Les candidatures sont stockées dans une base SQLite locale.

La table principale est :

candidats

Elle contient notamment :

identité du candidat ;

coordonnées ;

domaine ;

niveau ;

compétences ;

expérience ;

portfolio ;

GitHub ;

projets ;

CV ;

disponibilité ;

motivation ;

score ;

qualification ;

favori ;

statut ;

date de création.

Statuts disponibles

À traiter
À contacter
Entretien
Retenu
Refusé

🧪 Tests réalisés

Le système a été testé sur différents scénarios.

Validation

Candidature valide

Champs obligatoires manquants

Email invalide

Téléphone invalide

CV manquant

URL de CV invalide

Compétences absentes

Doublon d'email

Identifiant candidat invalide

Candidat inexistant

Scoring

Score maximum

Score minimum

Progression de l'expérience

Bonus portfolio

Bonus GitHub

Seuils de qualification

Gestion des candidats

Récupération de la liste

Récupération d'un profil

Recherche

Filtres

Favoris

Modification des statuts

Persistance après actualisation

Gestion des erreurs

Backend indisponible

Affichage d'une erreur utilisateur

Bouton de nouvelle tentative

Récupération après redémarrage du serveur

🚀 Installation

Prérequis

Node.js

npm

1. Installer le backend

cd backend
npm install

Puis lancer :

npm run dev

Le serveur démarre sur :

http://localhost:3000

2. Installer l'application candidat

Dans un autre terminal :

cd candidat
npm install
npm run dev

3. Installer l'application recruteur

Dans un troisième terminal :

cd recruteur
npm install
npm run dev

Le bouton de retour du recruteur utilise l'URL d'origine pour revenir à
l'accueil candidat. Pour définir une URL fixe en production, configurez
`VITE_CANDIDAT_URL` dans l'environnement de l'application recruteur.

Les deux interfaces frontend sont alors accessibles depuis les URLs affichées par Vite.

📁 Structure du projet

TestRecrutement/
│
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── database/
│ │ ├── services/
│ │ ├── types/
│ │ └── server.ts
│ ├── talent-engine.db
│ ├── package.json
│ └── tsconfig.json
│
├── candidat/
│ ├── src/
│ │ ├── components/
│ │ ├── services/
│ │ ├── types/
│ │ ├── App.tsx
│ │ └── main.tsx
│ ├── package.json
│ └── README.md
│
├── recruteur/
│ ├── src/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── types/
│ │ ├── App.tsx
│ │ └── main.tsx
│ ├── package.json
│ └── README.md
│
└── README.md

💡 Choix techniques

Le projet privilégie une architecture simple et adaptée au besoin.

Deux interfaces séparées

Les interfaces candidat et recruteur sont séparées afin de distinguer clairement :

le parcours de candidature ;

le parcours de gestion des candidatures.

Validation frontend + backend

La validation frontend améliore l'expérience utilisateur.

La validation backend garantit la sécurité et la cohérence des données.

SQLite

SQLite a été choisi car le projet ne nécessite pas une infrastructure de base de données complexe pour ce prototype.

Score déterministe

Le système de scoring utilise des règles explicites et reproductibles.

Deux candidats présentant exactement les mêmes caractéristiques obtiennent donc le même score.

🎯 Objectif du prototype

Talent Engine est conçu comme un prototype fonctionnel pouvant servir de base à une solution de recrutement plus complète.

Les évolutions possibles pourraient inclure :

authentification recruteur ;

gestion de plusieurs offres d'emploi ;

scoring adapté à chaque offre ;

import automatique des CV ;

analyse du contenu des CV ;

statistiques de recrutement ;

notifications ;

déploiement avec une base de données distante ;

gestion de plusieurs recruteurs.
