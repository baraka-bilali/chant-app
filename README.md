# Chant-App
Application web React (Vite) pour afficher des chants à partir d'un fichier JSON (Ch-CMI.json).
Le projet contient:
- Chargement des chants depuis `src/data/Ch-CMI.json`
- Liste des chants, affichage des paroles
- Playlists locales (stockées dans localStorage)

## Prérequis
- Node.js (version 18+ recommandée) et npm

## Installer et lancer
```bash
npm install
npm run dev
```

L'application démarre en local (par défaut `http://localhost:5173`).

## Notes
- Le projet est volontairement minimal pour démarrer vite.
- Pour ajouter Tailwind CSS, suis la doc officielle Tailwind + Vite.
- Pour synchroniser les playlists entre appareils, tu peux ajouter Firebase Auth + Firestore.
