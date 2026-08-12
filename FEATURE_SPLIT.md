# 📋 Répartition des Fonctionnalités par Développeur (Full-Stack Feature Ownership)

Pour une collaboration fluide et efficace à 2 développeurs, chaque développeur prend en charge des **fonctionnalités complètes de bout en bout (Backend API + Frontend React)**.

---

## 🎯 Vue d'ensemble du Découpage

```
                               ┌─────────────────────────────────────────┐
                               │             PROJECT QUIZAPP             │
                               └────────────────────┬────────────────────┘
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼                                                                     ▼
       👨‍💻 DÉVELOPPEUR A (dev-a)                                              👩‍💻 DÉVELOPPEUR B (dev-b)
  Core Platform, Auth, User/Data Management,                              Interactive Engine, Live Quiz,
     QCM Creation & AI Generation                                       Leaderboard, Gamification & Exports
```

---

## 👨‍💻 Développeur A (`dev-a`) — Module "Gestion, Création & IA"

> **Objectif :** Responsable de la gestion des utilisateurs/classes, de la création des QCM, de la banque de questions et du module d'Intelligence Artificielle.

### 1. Authentification & Sécurité (Full-stack)
- [ ] Backend : Spring Security + JWT, Login / Registre / Refresh Token / Hashage mots de passe.
- [ ] Frontend : Écrans de connexion/inscription, gestion de la session JWT, garde de routes (*Protected Routes*).

### 2. Gestion des Utilisateurs & Structure Académique (Full-stack)
- [ ] Backend : API CRUD Utilisateurs (Admin, Enseignant, Étudiant), Classes, Matières, Niveaux.
- [ ] Backend : Import des utilisateurs depuis Excel (Apache POI).
- [ ] Frontend : Interface Administration (Gestion des utilisateurs, filtres, recherche, attribution des classes et matières).

### 3. Gestion des QCM & Banque de Questions (Full-stack)
- [ ] Backend : CRUD QCM & Questions (Choix unique, Choix multiple, Vrai/Faux, Image, Chronométrée).
- [ ] Backend : Gestion de la banque de questions (Catégories, recherche, duplication, import Excel/Word/PDF).
- [ ] Frontend : Interface Enseignant pour composer un QCM, éditeur de questions riche avec prévisualisation.

### 4. 🤖 Feature Innovante : Génération de QCM par IA (Full-stack)
- [ ] Backend : Service d'intégration API LLM (OpenAI/LLM) pour parser et générer automatiquement des QCM à partir de fichiers (PDF, Word, PPT).
- [ ] Frontend : Interface de dépôt de documents, barre de progression de génération et écran de validation/édition des QCM générés par l'IA.

---

## 👩‍💻 Développeur B (`dev-b`) — Module "Sessions Live, Temps Réel & Gamification"

> **Objectif :** Responsable du moteur de quiz en temps réel (type Kahoot!), de l'expérience de jeu des étudiants/invités, des classements, de la gamification et des exports.

### 1. Organisation des Sessions & Participation (Full-stack)
- [ ] Backend : Création de session quiz, génération du Code PIN unique et du QR Code (ZXing).
- [ ] Backend : Support des modes de quiz (**Live, Examen, Challenge, Entraînement**).
- [ ] Frontend : Interface d'attente pour Étudiants / Invités (Saisie du PIN, QR Code, choix du Pseudonyme).

### 2. ⚡ Moteur Temps Réel - Déroulement du Quiz (Full-stack)
- [ ] Backend : Configuration WebSocket / STOMP pour la synchronisation temps réel (diffusion des questions, chronomètre serveur, collecte des réponses).
- [ ] Backend : Calcul automatique des scores et enregistrement des réponses.
- [ ] Frontend : Écran de jeu interactif en direct (Affichage des questions, boutons de réponse colorés style Kahoot!, compte à rebours, validation instantanée).

### 3. 🏆 Classement en Direct & Podium (Full-stack)
- [ ] Backend : Calcul du classement instantané et gestion du leaderboard.
- [ ] Frontend : Animation du classement après chaque question + Écran du **Podium Final** (Animation 1ère, 2ème, 3ème place).

### 4. 🏅 Gamification, Statistiques & Exports (Full-stack)
- [ ] Backend : Système de Badges, Médailles, Points et Niveaux.
- [ ] Backend : Module d'Export des résultats au format **Excel, PDF (iText) et CSV**.
- [ ] Frontend : Tableau de bord de statistiques (Graphiques de taux de réussite, questions faciles/difficiles) + Historique étudiant.

---

## 🔄 Points d'Intégration & Modèle de Données Commun

Pour garantir que les travaux de `dev-a` et `dev-b` s'assemblent parfaitement :

1. **Modèle de Données Référentiel (PostgreSQL) :**
   * `dev-a` alimente les tables : `utilisateurs`, `roles`, `classes`, `matieres`, `qcms`, `questions`, `reponses`, `document_sources`.
   * `dev-b` consomme les QCM et alimente les tables : `sessions_quiz`, `participations`, `reponses_etudiants`, `badges`, `exports`.

2. **Planning de développement suggéré :**
   * **Étape 1 :** `dev-a` met en place l'authentification et la structure QCM. `dev-b` prépare le socket et les écrans de jeu live.
   * **Étape 2 :** `dev-a` intègre l'IA et l'Admin. `dev-b` finalise le classement en direct, la gamification et les exports PDF/Excel.
