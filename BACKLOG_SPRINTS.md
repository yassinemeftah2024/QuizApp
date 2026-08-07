# 🎯 Répartition du Backlog par Sprint (Dev A & Dev B)

Voici l'organisation détaillée du Backlog en **3 Sprints**, où chaque développeur prend en charge des User Stories full-stack (Backend + Frontend).

---

## 🏃‍♂️ SPRINT 1 : Fondations, Auth & Gestion Administrative

### 👨‍💻 Développeur A (`dev-a`)
- **US-1.1 : Authentification & Sécurité**
  * *Backend :* API Auth JWT (Login, Registration, Refresh Token, Hashage BCrypt).
  * *Frontend :* Écrans de connexion / inscription avec gestion des jetons.
- **US-1.2 : Gestion des Profils**
  * *Backend :* API de consultation et mise à jour du profil utilisateur.
  * *Frontend :* Interface de gestion du profil (photo, mot de passe, infos).
- **US-1.3 : Gestion des Matières et Classes**
  * *Backend :* CRUD Matières (Nom, Code, Couleur) & Classes (Nom, Niveau, Année).
  * *Frontend :* Interface Admin pour ajouter/modifier/supprimer les matières et classes.

### 👩‍💻 Développeur B (`dev-b`)
- **US-1.4 : Architecture UI & Navigation React**
  * *Frontend :* Configuration de React Router, du layout principal, de la barre de navigation et des routes protégées par rôle.
- **US-1.5 : Module "Rejoindre une Session" (Étudiant & Invité)**
  * *Backend :* Endpoint d'accès rapide par Code PIN ou QR Code.
  * *Frontend :* Page d'accueil pour saisir le PIN / scanner le QR Code et choisir un Pseudonyme (mode Invité).
- **US-1.6 : Générateur de Code PIN & QR Code**
  * *Backend :* Service de génération de PIN unique (8 caractères) et génération d'image QR Code (ZXing).

---

## 🏃‍♂️ SPRINT 2 : Création de QCM, Banque & Moteur Temps Réel

### 👨‍💻 Développeur A (`dev-a`)
- **US-2.1 : Gestion des QCM (Enseignant)**
  * *Backend :* CRUD QCM (Titre, Matière, Durée, Niveau, Difficulté, Description).
  * *Frontend :* Formulaire d'édition de QCM avec options de configuration.
- **US-2.2 : Gestion des Questions & Réponses**
  * *Backend :* CRUD Questions (Choix unique, Choix multiple, Vrai/Faux, Image, Chronométrée) et leurs Reponses.
  * *Frontend :* Constructeur interactif de questions avec aperçu en direct.
- **US-2.3 : Banque de Questions & Imports**
  * *Backend :* Catégories, fonction de recherche, duplication et import Excel (Apache POI).
  * *Frontend :* Interface Banque de questions avec filtres et modal d'import.

### 👩‍💻 Développeur B (`dev-b`)
- **US-2.4 : Gestion & Programmation des Sessions Quiz**
  * *Backend :* API de création de session (QCM sélectionné, date, heure, mode de jeu).
  * *Frontend :* Dashboard Enseignant pour programmer et démarrer une session.
- **US-2.5 : Moteur de Quiz Temps Réel (WebSocket)**
  * *Backend :* Configuration WebSocket STOMP (diffusion synchrone des questions, chrono serveur, enregistrement des réponses).
  * *Frontend :* Intégration SockJS/STOMP.js pour synchroniser l'affichage en direct.
- **US-2.6 : Écran de Jeu Interactif (Style Kahoot!)**
  * *Frontend :* Interface joueur dynamique (Question, timer circulaire, boutons de réponse colorés, retour immédiat).

---

## 🏃‍♂️ SPRINT 3 : IA, Classement Live, Gamification & Exports

### 👨‍💻 Développeur A (`dev-a`)
- **US-3.1 : 🤖 Module Innovant — Génération de QCM par IA**
  * *Backend :* Parsing de documents (PDF/Word/PPT) et appel à l'API LLM pour extraire automatiquement des QCM.
  * *Frontend :* Zone de drag-and-drop de fichier, barre de chargement et écran de validation/révision des QCM générés.
- **US-3.2 : Modes de Quiz Avancés**
  * *Backend & Frontend :* Implémentation du **Mode Examen** (chronomètre global, tentative unique) et du **Mode Entraînement** (tentatives illimitées avec explications).
- **US-3.3 : Tableaux de Bord & Statistiques Enseignant**
  * *Backend & Frontend :* Analytics (Taux de réussite, question la plus difficile/facile, graphiques).

### 👩‍💻 Développeur B (`dev-b`)
- **US-3.4 : Classement en Direct & Animation Podium**
  * *Backend :* Calcul et mise à jour dynamique du classement après chaque question.
  * *Frontend :* Écran de classement entre deux questions + Animation finale du **Podium (1ère, 2ème, 3ème place)**.
- **US-3.5 : Système de Gamification**
  * *Backend & Frontend :* Gestion des Badges, Médailles, Points d'expérience et Niveaux attribués aux étudiants.
- **US-3.6 : Module d'Exportation & Historique**
  * *Backend :* Génération de rapports au format **Excel, PDF (iText) et CSV**.
  * *Frontend :* Boutons d'exportation + Consultation de l'historique complet des participations.
