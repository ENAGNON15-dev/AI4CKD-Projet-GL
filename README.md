# AI4CKD-Hackathon-Project
Plateforme web intelligente pour la gestion des patients atteints de maladie rénale chronique, développée dans le cadre d’un hackathon en Génie Logiciel.
# Projet AI4CKD - Hackathon de Génie Logiciel

Ce dépôt contient le prototype d'application web développé dans le cadre du hackathon AI4CKD, visant à améliorer la gestion des patients atteints de maladie rénale chronique (MRC). Le projet a été réalisé par [Votre Nom/Noms des membres de l'équipe] pour les étudiants de troisième année de Licence en Génie Logiciel de l'Institut de Formation et de Recherche en Informatique (IFRI).

## 🎯 Objectifs du Projet

L'objectif général est de développer une application web sécurisée, évolutive et ergonomique, focalisée sur deux fonctionnalités clés :

1.  **Système intelligent de détection et d'alerte automatique des situations cliniques critiques.**
2.  **Module de génération de synthèse PDF à partir des données patients.**

## ✨ Fonctionnalités Implémentées

### 1. Gestion des Patients
* Ajout de nouveaux patients avec leurs informations démographiques (Nom, Prénom, Date de Naissance, Sexe, Antécédents).
* Affichage d'une liste de tous les patients enregistrés.
* Consultation des détails complets de chaque patient, y compris son historique de consultations et les alertes associées.
* Modification des informations d'un patient existant.
* Suppression de patients (avec confirmation).

### 2. Système d'Alertes Intelligentes
* **Détection automatique des situations à risque :** Le backend analyse les données cliniques soumises lors de chaque nouvelle consultation (ex: créatinine, tension artérielle, poids) pour identifier si les valeurs dépassent des seuils prédéfinis.
* **Déclenchement des alertes :** Une alerte est générée et enregistrée en base de données si une situation clinique critique est détectée.
* **Affichage visuel des alertes :** Les alertes actives et résolues sont clairement signalées dans l'interface utilisateur sur la page de détails du patient, avec des badges colorés et des messages explicatifs.
* **Règles d'alerte configurables :** Les seuils et les logiques de détection des alertes sont définis dans le service backend (`backend/src/services/alertService.js`), permettant une adaptation facile des critères médicaux.

### 3. Génération PDF du Dossier Patient
* **Export PDF à tout moment :** Sur la page de détails de chaque patient, un bouton permet de générer et de télécharger instantanément un document PDF.
* **Contenu du document PDF :** Le PDF inclut de manière structurée et lisible :
    * L'identité complète du patient.
    * Ses antécédents médicaux.
    * La liste chronologique de toutes les consultations enregistrées, avec toutes les valeurs cliniques pertinentes (tension, créatinine, poids, glycémie, notes).
    * Un résumé de toutes les alertes qui ont été déclenchées pour ce patient, avec leur type, message et statut.
* **Design professionnel :** Le document PDF est formaté avec un design sobre et clair, optimisé pour la lisibilité et l'utilisation dans un contexte médical.

### 4. Authentification Utilisateur
* **Inscription :** Permet aux nouveaux utilisateurs de créer un compte avec un email et un mot de passe. Les mots de passe sont hachés de manière sécurisée (avec `bcryptjs`) avant d'être stockés en base de données.
* **Connexion :** Les utilisateurs existants peuvent se connecter avec leurs identifiants. En cas de succès, un JSON Web Token (JWT) est généré et envoyé au frontend.
* **Protection des routes :** Toutes les routes API sensibles du backend (gestion des patients, consultations, alertes, génération PDF) sont protégées par un middleware d'authentification. Seuls les utilisateurs munis d'un token JWT valide peuvent y accéder.
* **Gestion de session côté client :** Le token JWT est stocké localement dans le navigateur, permettant de maintenir la session de l'utilisateur.

## 🚀 Technologies Utilisées

### Backend (Node.js / Express.js)
* **Node.js** : Environnement d'exécution JavaScript côté serveur.
* **Express.js** : Framework web minimaliste et flexible pour construire des APIs RESTful.
* **PostgreSQL** : Système de gestion de base de données relationnelle robuste et open-source, utilisé pour stocker toutes les données de l'application (patients, consultations, alertes, utilisateurs).
* **Sequelize ORM** : Object-Relational Mapper pour Node.js, facilitant l'interaction avec PostgreSQL en utilisant des objets JavaScript.
* **bcryptjs** : Bibliothèque pour le hachage sécurisé des mots de passe.
* **jsonwebtoken** : Implémentation des JSON Web Tokens (JWT) pour l'authentification sans état.
* **html-pdf** : Bibliothèque pour la génération de documents PDF à partir de contenu HTML et CSS.

### Frontend (React.js)
* **React.js** : Bibliothèque JavaScript déclarative pour la construction d'interfaces utilisateur interactives et basées sur des composants.
* **React Router DOM** : Bibliothèque standard pour la gestion du routage (navigation entre les pages) au sein de l'application React.
* **Axios** : Client HTTP basé sur les promesses pour effectuer des requêtes vers l'API backend.
* **React Context API** : Mécanisme natif de React pour la gestion de l'état global de l'application, notamment pour l'authentification.

## 📦 Structure du Projet


ai4ckd-project/
├── backend/                  # Contient le code du serveur Node.js/Express
│   ├── src/
│   │   ├── config/           # Configuration de la connexion à la base de données (db.js)
│   │   ├── models/           # Définitions des modèles Sequelize (patient.js, consultation.js, alert.js, user.js)
│   │   ├── controllers/      # Logique métier des requêtes API (patientController.js, consultationController.js, alertController.js, pdfController.js, authController.js)
│   │   ├── routes/           # Définition des routes API (patientRoutes.js, consultationRoutes.js, alertRoutes.js, pdfRoutes.js, authRoutes.js)
│   │   ├── services/         # Logique spécifique (ex: alertService.js pour la détection d'alertes)
│   │   ├── middleware/       # Middlewares Express (ex: authMiddleware.js pour la protection des routes)
│   │   └── app.js            # Point d'entrée principal du serveur backend
│   ├── .env.example          # Exemple de fichier de variables d'environnement pour le backend
│   ├── package.json          # Liste des dépendances Node.js et scripts de démarrage du backend
│   └── README.md             # README spécifique au backend (optionnel, pour des détails techniques approfondis)
├── frontend/                 # Contient le code de l'application React
│   ├── public/               # Fichiers statiques servis directement (index.html, manifest.json, favicons)
│   │   └── index.html        # Point d'entrée HTML de l'application React
│   ├── src/
│   │   ├── components/       # Composants React réutilisables (PatientForm.js, ConsultationForm.js, AlertDisplay.js, PrivateRoute.js)
│   │   ├── pages/            # Composants React représentant les pages principales de l'application (HomePage.js, PatientPage.js, LoginPage.js, RegisterPage.js)
│   │   ├── services/         # Fonctions pour les appels API frontend (api.js)
│   │   ├── context/          # Contexte React (AuthContext.js pour la gestion de l'authentification)
│   │   ├── App.js            # Composant racine de l'application React, configure le routage et l'authentification
│   │   ├── index.js          # Point d'entrée JavaScript de l'application React (rend le composant App)
│   │   └── index.css         # Styles CSS globaux de l'application
│   ├── .env.example          # Exemple de fichier de variables d'environnement pour le frontend
│   ├── package.json          # Liste des dépendances React et scripts de démarrage du frontend
│   └── README.md             # README spécifique au frontend (optionnel, pour des détails techniques approfondis)
├── .gitignore                # Fichier pour spécifier les fichiers et dossiers à ignorer par Git (ex: node_modules, .env)
└── README.md                 # Ce fichier : le README principal du projet


## ⚙️ Installation et Démarrage

Suivez ces étapes pour configurer et exécuter le projet localement sur votre machine.

### Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre système :

* **Node.js** (version 16 ou supérieure recommandée) : Téléchargez depuis [nodejs.org](https://nodejs.org/).
* **npm** (Node Package Manager) : Généralement installé avec Node.js.
* **PostgreSQL** : Un serveur de base de données PostgreSQL doit être installé et en cours d'exécution. Téléchargez depuis [postgresql.org](https://www.postgresql.org/download/).

### 1. Configuration de la Base de Données PostgreSQL

1.  Assurez-vous que votre serveur PostgreSQL est démarré.
2.  Connectez-vous à votre base de données PostgreSQL (par exemple, via `psql` ou un outil comme DBeaver/pgAdmin).
3.  Créez une nouvelle base de données pour ce projet. Par exemple, exécutez la commande SQL suivante :
    ```sql
    CREATE DATABASE ai4ckd_db;
    ```
4.  Assurez-vous que l'utilisateur PostgreSQL que vous utiliserez pour la connexion a les droits nécessaires sur cette base de données.

### 2. Configuration et Démarrage du Backend

1.  Ouvrez votre terminal ou invite de commande.
2.  Naviguez vers le répertoire du backend de votre projet :
    ```bash
    cd ai4ckd-project/backend
    ```
3.  Installez toutes les dépendances Node.js requises pour le backend :
    ```bash
    npm install
    ```
4.  Créez un fichier nommé `.env` à la racine du dossier `backend` (`ai4ckd-project/backend/.env`). Copiez le contenu de `backend/.env.example` dans ce nouveau fichier et remplacez les valeurs placeholders par vos informations de connexion PostgreSQL et une clé secrète JWT forte.
    ```dotenv
    PORT=5000
    DB_HOST=localhost
    DB_USER=votre_utilisateur_postgres
    DB_PASSWORD=votre_mot_de_passe_postgres
    DB_NAME=ai4ckd_db
    JWT_SECRET=une_tres_longue_chaine_de_caracteres_aleatoires_et_secrete_pour_jwt_!@#$%^&*()_+
    ```
    *Remplacez `votre_utilisateur_postgres`, `votre_mot_de_passe_postgres`, et `une_tres_longue_chaine_de_caracteres_aleatoires_et_secrete_pour_jwt_!@#$%^&*()_+` par vos propres valeurs.*
5.  Démarrez le serveur backend :
    ```bash
    npm run dev
    ```
    Vous devriez voir des messages dans le terminal indiquant que le serveur est démarré sur `http://localhost:5000` et que les modèles de base de données ont été synchronisés (les tables `Patients`, `Consultations`, `Alerts`, et `Users` seront créées ou mises à jour dans votre base de données PostgreSQL).

### 3. Configuration et Démarrage du Frontend

1.  Ouvrez un **nouveau terminal ou invite de commande** (gardez le terminal du backend ouvert et en exécution).
2.  Naviguez vers le répertoire du frontend de votre projet :
    ```bash
    cd ai4ckd-project/frontend
    ```
3.  Installez toutes les dépendances React requises pour le frontend :
    ```bash
    npm install
    ```
4.  Créez un fichier nommé `.env` à la racine du dossier `frontend` (`ai4ckd-project/frontend/.env`). Copiez le contenu de `frontend/.env.example` dans ce nouveau fichier et ajoutez l'URL de votre API backend :
    ```dotenv
    REACT_APP_API_BASE_URL=http://localhost:5000/api
    ```
5.  Démarrez l'application React :
    ```bash
    npm start
    ```
    L'application devrait s'ouvrir automatiquement dans votre navigateur par défaut (généralement `http://localhost:3000`).

## 🧪 Comment Tester l'Application

Suivez ces étapes pour vérifier le bon fonctionnement de toutes les fonctionnalités :

1.  **Accès Initial :**
    * Lorsque l'application s'ouvre dans votre navigateur, vous serez automatiquement redirigé vers la page de connexion (`/login`) car l'accès aux données est protégé.

2.  **Inscription d'un Nouvel Utilisateur :**
    * Sur la page de connexion, cliquez sur le lien "Pas encore de compte ? S'inscrire ici".
    * Remplissez les champs `Email` et `Mot de passe`, puis `Confirmer le mot de passe`.
    * Cliquez sur le bouton "S'inscrire".
    * **Résultat attendu :** Un message de succès s'affiche, et vous êtes automatiquement redirigé vers la page d'accueil (`/`).

3.  **Connexion et Déconnexion :**
    * Si vous êtes déconnecté, utilisez l'email et le mot de passe de l'utilisateur que vous venez de créer sur la page de connexion.
    * Cliquez sur "Se connecter".
    * **Résultat attendu :** Vous êtes redirigé vers la page d'accueil, et la barre de navigation affiche "Bienvenue, votre_email@exemple.com" et un bouton "Déconnexion".
    * Cliquez sur le bouton "Déconnexion".
    * **Résultat attendu :** Vous êtes redirigé vers la page de connexion, et les liens "Connexion" et "Inscription" réapparaissent dans la barre de navigation.

4.  **Gestion des Patients :**
    * **Ajouter un patient :** Sur la page d'accueil, cliquez sur "Ajouter un nouveau patient". Remplissez le formulaire (Nom, Prénom, Date de Naissance, Sexe sont obligatoires). Cliquez sur "Enregistrer Patient".
    * **Résultat attendu :** Le nouveau patient apparaît dans la liste sur la page d'accueil.
    * **Voir les détails :** Cliquez sur le nom d'un patient dans la liste.
    * **Résultat attendu :** Vous accédez à la page de détails du patient, affichant ses informations, un historique des consultations et une section pour les alertes.

5.  **Système d'Alertes Intelligentes :**
    * Sur la page de détails d'un patient, cliquez sur le bouton "Ajouter une nouvelle consultation".
    * Saisissez des valeurs cliniques qui devraient déclencher une alerte, par exemple :
        * **Créatinine :** Pour un homme, entrez `1.5` (le seuil est 1.3). Pour une femme, entrez `1.1` (le seuil est 1.0).
        * **Tension Artérielle :** Entrez `150/95` (le seuil est 140/90).
        * **Poids (pour l'alerte de perte rapide) :** Si c'est la première consultation, donnez un poids initial (ex: `80`). Ajoutez ensuite une deuxième consultation **pour le même patient** avec un poids significativement inférieur (ex: `75` kg, ce qui représente plus de 5% de perte par rapport à 80 kg).
    * Cliquez sur "Enregistrer Consultation".
    * **Résultat attendu :** La nouvelle consultation apparaît dans l'historique. **Une ou plusieurs alertes (selon les valeurs saisies) apparaissent visuellement** dans la section "Alertes Déclenchées" avec un statut "Active" et un message explicatif.

6.  **Génération PDF du Dossier Patient :**
    * Sur la page de détails d'un patient (idéalement un patient avec plusieurs consultations et alertes pour un PDF riche), cliquez sur le bouton **"Générer la synthèse PDF"**.
    * **Résultat attendu :** Votre navigateur déclenche le téléchargement d'un fichier PDF (nommé `dossier_patient_NOM_PRENOM.pdf`).
    * Ouvrez le fichier PDF téléchargé.
    * **Résultat attendu :** Le document PDF contient l'identité du patient, ses antécédents, un tableau détaillé de ses consultations et un résumé clair de toutes les alertes déclenchées. Le format est propre et lisible.

## 🤝 Contribution

Ce projet est un prototype développé dans le cadre d'un hackathon. Il est ouvert aux améliorations et aux contributions. N'hésitez pas à proposer des fonctionnalités, des corrections de bugs ou des optimisations.

## 📧 Contact

Pour toute question ou support concernant ce projet, veuillez contacter :
* [AGOSSOU Enagnon Etienne ] - [enagnonetienneagossou@gmail.com]
* Dr (MA) Ratheil HOUNDJI - vratheilhoundji@gmail.com
* Mme Samira MVOGO - mvosamira@gmail.com
* Ing. Maryse GAHOU - marysegahou@gmail.com

---
