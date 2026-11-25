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

## Publier sur Android et iOS
Pour installer l'app hors Expo Go (APK / App Store / Play Store), utilise Expo Build :
```bash
npx eas-cli@latest build --platform android
```
Avant la première publication, ajoute `ios.bundleIdentifier` et `android.package` dans `app.json`,
et remplace les icônes dans `assets/images/` (ce sont pour l'instant les icônes par défaut d'Expo).
