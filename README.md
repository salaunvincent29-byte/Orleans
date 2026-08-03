# La Chronique des huit preuves — V3.1

PWA familiale consacrée à Jeanne d’Arc et Orléans. Cette version limite chaque monument à deux épreuves maximum et ajoute une transition guidée entre toutes les étapes avec nom du lieu, adresse, temps de marche indicatif et indice narratif.


Jeu d’enquête patrimoniale familial sur Jeanne d’Arc à Orléans. La PWA fonctionne sans dépendance externe, sans compte utilisateur et hors connexion après le premier chargement.

## Mise en ligne sur GitHub Pages

1. Décompressez le fichier ZIP.
2. Copiez **le contenu du dossier** à la racine d’un dépôt GitHub. Le fichier `index.html` doit être visible directement sur la page principale du dépôt.
3. Ouvrez `Settings` → `Pages`.
4. Dans `Build and deployment`, choisissez `Deploy from a branch`.
5. Sélectionnez la branche `main` et le dossier `/ (root)`, puis enregistrez.
6. Lorsque le déploiement est terminé, GitHub affiche l’adresse dans `Settings` → `Pages`.

L’adresse suit généralement ce format :

```text
https://VOTRE-COMPTE.github.io/NOM-DU-DEPOT/
```

## Mise à jour depuis une version précédente

Remplacez les anciens fichiers par ceux de cette V3, puis validez les changements dans GitHub. Le service worker utilise un nouveau nom de cache (`huit-preuves-v3.1.0`). Après le redéploiement, rechargez une fois la page avec une connexion active.

Sur iPhone ou iPad, Safari peut conserver une ancienne version installée. Si nécessaire :

1. Supprimez l’ancienne icône de l’écran d’accueil.
2. Ouvrez la nouvelle adresse dans Safari.
3. Touchez `Partager` → `Sur l’écran d’accueil`.

## Contenu

- huit missions étroitement liées aux lieux visités ;
- plus de trente-cinq énigmes et micro-jeux ;
- classement histoire / trace / mémoire ;
- chronologies, cartographie, puzzle de vitrail et jeu de mémoire ;
- trois niveaux d’indices ;
- mode mission courte et mode adulte ;
- sauvegarde locale de la progression ;
- diplôme final imprimable ;
- illustrations SVG et icônes intégrées ;
- fonctionnement hors connexion.

## Structure

```text
index.html
styles.css
app.js
sw.js
manifest.webmanifest
404.html
assets/
tests/
README.md
TEST_REPORT.md
```

## Données et confidentialité

Les noms, réponses et progrès sont enregistrés uniquement dans le stockage local du navigateur. Aucune donnée n’est envoyée vers un serveur. La géolocalisation n’est pas utilisée.

## Réinitialisation

Dans l’application : `Réglages` → `Mode adulte` → `Réinitialiser toute l’aventure`.

## Compatibilité

- Safari récent sur iOS/iPadOS ;
- Chrome et Edge récents sur Android et ordinateur ;
- Firefox récent pour l’usage dans le navigateur.

L’installation PWA dépend des possibilités du navigateur et du système d’exploitation.
