# 🚀 SOSGAZ DOMESTIC — Votre gaz, en un clic !

> **Plateforme web moderne de commande et livraison rapide de gaz domestique à Abidjan (Côte d'Ivoire).**  
> Fini les pannes de gaz en pleine préparation de repas : commandez en ligne en moins de 60 secondes ou via WhatsApp avec suivi en temps réel !

---

## 🌟 Fonctionnalités Clés

### 🛒 Espace Public & Expérience Client
- **Catalogue complet multi-formats** :
  - **B6** (Fait-tout 6 kg)
  - **B12.5** (Bouteille standard familiale 12.5 kg)
  - **B28** (Grand format 28 kg)
  - Support de toutes les grandes marques du marché ivoirien (*TotalEnergies, Oryx Energies, Petroci, etc.*).
- **Processus de commande simplifié en 2 étapes** :
  - **Étape 1** : Choix du format, mode échange de bouteille vide ou nouvel achat, sélection du délai (Express 30-45 min ou Standard).
  - **Étape 2** : Localisation précise à Abidjan (communes : *Cocody, Yopougon, Marcory, Plateau, Koumassi, Treichville, Port-Bouët, Abobo, Adjamé, Attécoubé, etc.* + quartiers et repères visuels ivoiriens).
- **Suivi de commande transparent** : Page publique de suivi avec timeline visuelle des étapes (*Confirmée ➔ Assignée ➔ En livraison ➔ Livrée*).
- **Intégration directe WhatsApp** : Possibilité de finaliser sa commande ou de contacter un conseiller d'un simple clic avec message pré-rempli.
- **Transparence tarifaire** : Affichage clair du sous-total, des frais de livraison et du prix total en FCFA.

### 🛡️ Espace Administration & Opérations (`/admin`)
- **Tableau de bord dynamique (KPIs)** :
  - Volume de commandes, chiffre d'affaires total, commission SOSGAZ, reversement partenaires.
  - Taux de livraison réussie, gestion des incidents en cours.
- **Gestion du Cycle de Vie des Commandes** :
  - Progression d'état stricte (*En attente ➔ Confirmée ➔ En préparation ➔ Prise en charge livreur ➔ En cours de livraison ➔ Livrée / Annulée / Incident*).
  - Attribution directe aux livreurs de la zone.
  - Déclaration et clôture d'incidents (rupture de stock, client injoignable, retard, etc.).
- **Journal d'Audit Sécurisé & Inaltérable** : Historique traçable de toutes les actions administratives avec horodatage local Abidjan.
- **Gestion des Dépôts Partenaires & Flotte de Livreurs** : Liste, disponibilité, zones couvertes et contacts directs.
- **Grille Tarifaire & Zones Abidjanaises** : Visualisation des prix de recharge, des bouteilles complètes et des frais de livraison par commune.
- **Contrôle d'accès par rôle** : Bascule immédiate entre rôle **Administrateur** et **Opérateur**.

---

## 🛠️ Stack Technique

- **Framework** : [Next.js](https://nextjs.org/) (App Router, Turbopack, React Server & Client Components)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **UI & Design** : [React 19](https://react.dev/), Vanilla CSS moderne, responsive mobile/tablette/bureau
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Persistance des données** : LocalStorage avec synchronisation réactive et initialisation mockée prête à l'emploi.

---

## 📂 Structure du Projet

```text
├── app/
│   ├── (public)/                 # Pages publiques (Accueil, Commander, Catalogue, Zones, Contact, Suivi...)
│   │   ├── catalogue/
│   │   ├── commande/confirmation/
│   │   ├── commander/
│   │   ├── comment-ca-marche/
│   │   ├── contact/
│   │   ├── legal/
│   │   ├── partenaire/
│   │   └── zones/
│   ├── admin/                    # Espace d'administration & back-office
│   │   ├── (protected)/          # Tableau de bord, Commandes, Journal, Incidents, Livreurs...
│   │   └── login/
│   ├── globals.css               # Système de styles, tokens et variables CSS
│   └── layout.tsx                # Layout racine et polices optimisées
├── components/
│   ├── admin/                    # Composants back-office (Modales, Détails commandes...)
│   └── public/                   # Composants client (Navbar, Footer, Cartes produits...)
├── context/
│   └── order-context.tsx         # Gestion d'état global, journal d'audit et persistance
├── data/
│   └── mock-data.ts              # Données de référence (Produits, Communes, Livreurs, Dépôts)
├── lib/
│   ├── format.ts                 # Formateurs de devise FCFA et dates Abidjan
│   └── pricing.ts                # Moteur de calcul des prix, commissions et livraisons
└── types/
    └── index.ts                  # Types TypeScript stricts
```

---

## 🚀 Installation et Lancement

### 1. Prérequis
- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- `npm`, `pnpm` ou `yarn`

### 2. Cloner le projet
```bash
git clone https://github.com/mohamedtoure08live-bot/SGAZ.git
cd SGAZ
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour tester l'application.

### 5. Compiler pour la production
```bash
npm run build
npm run start
```

---

## 👥 Auteur & Support
- **SOSGAZ Domestic CI** — Service de livraison de gaz à domicile à Abidjan.
- Dépôt officiel : [mohamedtoure08live-bot/SGAZ](https://github.com/mohamedtoure08live-bot/SGAZ)
