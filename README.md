# Recueil CMI

Application mobile (Android + iOS, et web) du recueil de chants de la communauté, construite avec
**Expo SDK 58**, **React Native 0.88**, **React 19** et **Expo Router**.

- Liste des 854 chants avec recherche (titre, numéro ou paroles, sans tenir compte des accents)
- Affichage des paroles : couplets numérotés, refrain mis en valeur (une seule fois, après le couplet 1)
- Playlists locales (stockées sur l'appareil avec AsyncStorage)
- Thème clair / sombre

## Prérequis
- Node.js 20+ et npm
- L'app **Expo Go** sur ton téléphone (Android / iOS) pour tester avec le QR code

## Lancer l'app
```bash
npm install
npm start
```
Un **QR code** s'affiche dans le terminal : scanne-le avec Expo Go (Android) ou avec l'appareil photo (iOS).
Le téléphone et le PC doivent être sur le même Wi-Fi.

Autres commandes : `npm run android`, `npm run ios`, `npm run web`, `npm run lint`, `npm run typecheck`.

## Structure
```
src/
├─ app/                 écrans (Expo Router : chaque fichier est une route)
│  ├─ (tabs)/index.tsx      liste + recherche
│  ├─ (tabs)/playlists.tsx  playlists
│  ├─ song/[id].tsx         paroles d'un chant
│  └─ playlist/[id].tsx     contenu d'une playlist
├─ components/          composants (ligne de chant, paroles, sélecteur de playlist…)
├─ context/             état global (playlists, thème) + stockage
├─ data/A-S.json        le recueil (généré, voir ci-dessous)
├─ data/songs.ts        chargement et recherche des chants
└─ lib/                 utilitaires (analyse des paroles, normalisation du texte)
```

## Mettre à jour le recueil depuis VideoPsalm
Les chants viennent de `A-S.json` (VideoPsalm). Pour régénérer `src/data/A-S.json` après une modification :
```bash
npm run convert -- "C:/Users/Public/Documents/VideoPsalm/SongBooks/A-S.json" src/data/A-S.json
```
Chaque refrain n'est conservé qu'une fois, après le premier couplet. Ajoute `full` en 3e argument pour le rapport complet.

## Android : créer l'APK
```bash
npx eas-cli@latest build --platform android --profile preview
```
Le build se fait sur les serveurs d'Expo. Les identifiants d'application (`org.cmipascal.recueil`) et les icônes sont déjà configurés dans `app.json`.

## Version web pour iPhone (PWA sur Vercel)
La version web est la même app, exportée en site statique, installable sur l'écran d'accueil et lisible **sans internet**
(un service worker met toute l'app en cache après la première visite).

```bash
npm run build:web      # exporte dans dist/ puis génère dist/sw.js
```

**Déployer sur Vercel** (une seule fois) :
1. Sur vercel.com : *Add New… → Project*, importer le dépôt GitHub `chant-app`.
2. Laisser les réglages par défaut : `vercel.json` fournit la commande de build (`npm run build:web`), le dossier de sortie (`dist`) et la redirection des liens directs.
3. *Deploy*. Chaque `git push` sur `main` met ensuite le site à jour.

**Installer sur iPhone** : ouvrir le lien dans **Safari** → bouton Partager → *Sur l'écran d'accueil*.
(Une bannière dans l'app explique ces étapes aux utilisateurs iPhone.)

Fichiers concernés : `public/index.html` (balises iOS, enregistrement du service worker), `public/manifest.json`,
icônes `public/logo*.png`, `scripts/build-sw.js` (génère le service worker), `vercel.json`.
