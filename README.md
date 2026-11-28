# Recueil CMI

Application mobile (Android + iOS, et web) du recueil de chants de la communauté, construite avec
**Expo SDK 58**, **React Native 0.88**, **React 19** et **Expo Router**.

- Liste des 854 chants (numéro + un seul titre, en casse normale) avec recherche « titre puis paroles » comme VideoPsalm : chaque mot tapé doit commencer un mot du titre ; les paroles ne sont proposées qu'en complément (ou si aucun titre ne correspond). Accents ignorés.
- Bouton **123** à côté du champ de recherche : grille de tous les numéros (001, 002…) pour ouvrir un chant directement
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
│  ├─ (tabs)/index.tsx      liste + recherche (voir lib/search.ts) · numbers/[id].tsx grille des numéros
│  ├─ (tabs)/playlists.tsx  playlists
│  ├─ song/[id].tsx         paroles d'un chant
│  └─ playlist/[id].tsx     contenu d'une playlist
├─ components/          composants (ligne de chant, paroles, sélecteur de playlist…)
├─ context/             état global (playlists, thème) + stockage
├─ data/A-S.json        le recueil (généré, voir ci-dessous)
├─ data/songs.ts        chargement des chants (src/lib/search.ts : recherche titre puis paroles)
└─ lib/                 utilitaires (analyse des paroles, normalisation du texte)
```

## Langues, favoris et menu
- **Langues de l'interface** : français, anglais et lingala (menu ⋮ → Langue). Au premier lancement, l'app suit la langue du téléphone
  (français par défaut). Les textes sont dans `src/i18n/dictionaries.ts`. Les paroles des chants gardent leur langue d'origine.
  La traduction en lingala est une première version : à faire relire par un locuteur natif.
- **Favoris** : le marque-page de la barre du haut ouvre la liste ; sur la page d'un chant, le marque-page ajoute ou retire le chant.
- **Menu ⋮** : langue, thème clair/sombre, partager l'application, astuces et aide (revoir l'introduction), nous contacter, à propos.

## Recueils (collections)
Après l'introduction, l'écran d'accueil affiche les recueils sous forme de couvertures :
**Chants d'ensemble** (854 chants) et **Recueil Chorale Tome 1** (« Bientôt disponible »).
Ils sont définis dans `src/data/collections.ts` (titre, couleurs de la couverture, chants). Pour remplir le
« Recueil Chorale Tome 1 » : convertir son fichier VideoPsalm (voir ci-dessous), l'importer comme `ensembleSongs` dans
`src/data/songs.ts`, puis mettre `songs` et `comingSoon: false` dans `collections.ts`.
Les playlists fonctionnent sur tous les recueils.

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

## Site de téléchargement (`site/`)
Un petit site statique (HTML/CSS/JS, sans build) présente l'application et permet de la télécharger :
bouton **APK Android**, lien vers la **version web (PWA)**, **deux QR codes** (APK et web) et un explorateur de fonctionnalités.

- `site/index.html`, `site/css/styles.css`, `site/js/main.js` : le site. Les liens (adresse de la PWA, WhatsApp, e-mail, version, taille de l'APK) sont réglés en haut de `site/js/main.js` (`CONFIG`).
- `site/downloads/recueil-cmi.apk` : le fichier APK proposé au téléchargement.
- `site/images/shots/` : captures d'écran de l'app utilisées sur le site.
- `site/js/qrcode.js` : générateur de QR codes (MIT), les codes sont créés dans le navigateur.

**Tester en local** : `npx serve site` puis ouvrir l'adresse affichée.

**Déployer sur Vercel** (un second projet, distinct de la PWA) :
1. *Add New… → Project*, importer le même dépôt `chant-app`.
2. Dans *Root Directory*, choisir **`site`** (Framework Preset : *Other*, aucune commande de build).
3. *Deploy*. Le QR code de l'APK pointe automatiquement vers l'adresse du site.

**Mettre à jour l'APK** : après un nouveau build (`eas build`), télécharger le nouvel APK depuis la page du build Expo, le remplacer dans `site/downloads/recueil-cmi.apk`, mettre à jour `version` et `apkSize` dans `CONFIG`, puis `git push`.

## Vidéo de présentation (`video/`)
Vidéo motion design (~1 min 20, 4K, voix off en français) réalisée avec [Remotion](https://www.remotion.dev) : présentation de l'app,
installation sur iPhone pas à pas, Android, et contact en cas de souci.

**Voix off naturelle (ElevenLabs ou OpenAI)** : le texte est dans `video/voice/script.json`. Avec votre propre clé d'API :
```powershell
cd video
$env:ELEVENLABS_API_KEY = "votre-clé"; $env:ELEVENLABS_VOICE_ID = "id-d-une-voix-française"; node voice/tts.mjs elevenlabs
$env:OPENAI_API_KEY = "votre-clé"; node voice/tts.mjs openai
```
Les MP3 (voix complète + une phrase par fichier) et `placement.txt` (où placer chaque phrase dans CapCut) arrivent dans `video/out/voix-off/`.

Une voix Windows de secours (« Microsoft Julie ») peut aussi être générée (« Microsoft Julie ») à partir de `video/voice/lines.json`.
Pour changer le texte ou la voix (« Microsoft Paul », « Microsoft Hortense »), modifier ce fichier puis relancer
les deux commandes de voix ci-dessous. Pour une voix enregistrée par une personne, remplacer simplement les fichiers
`video/public/voice/*.wav` (mêmes noms) puis relancer `node voice/measure.js`.

```bash
cd video
npm install
npm run music     # génère la musique de fond (public/music.wav)
powershell -ExecutionPolicy Bypass -File voice/make-voice.ps1 -Voice "Microsoft Julie"   # voix off
node voice/measure.js                                                                   # calage de la voix
npm run studio    # aperçu et retouches dans le navigateur
npm run render    # rend out/recueil-cmi-4k.mp4 (3840×2160)
npm run render:hd # version 1080p plus légère pour WhatsApp
```
Les textes (adresse web, téléphone, e-mail, adresse du site de téléchargement) se modifient dans `video/src/theme.ts` (`INFO`).

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
