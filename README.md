# La chronique perdue de Jeanne d’Arc — PWA V2

Application familiale autonome pour une visite historique d’Orléans avec une enfant d’environ 7 ans.

## Nouveautés V2

- huit missions composées de véritables micro-jeux ;
- deux puzzles par échange de pièces ;
- message codé et vrai/faux historique ;
- choix tactique et mini-labyrinthe ;
- jeu de classement « histoire ou mémoire » ;
- séquence de mémoire animée ;
- bingo du petit train ;
- memory des objets et assemblage de la date ;
- inventaire, sceaux, courage, fragments et diplôme ;
- illustrations vectorielles intégrées et animations ;
- sauvegarde locale et fonctionnement hors connexion ;
- modes mission courte, contraste renforcé et réduction des animations.

## Déploiement sur GitHub Pages

1. Décompresser le ZIP.
2. Copier **le contenu du dossier**, notamment `index.html`, `app.js`, `styles.css`, `sw.js` et `assets`, directement à la racine du dépôt GitHub.
3. Valider les changements sur la branche `main`.
4. Dans `Settings → Pages`, sélectionner `Deploy from a branch`, puis `main` et `/root`.
5. Ouvrir l’adresse indiquée par GitHub dans l’encadré `Your site is live at…`.

L’adresse a généralement la forme :

`https://NOM-UTILISATEUR.github.io/NOM-DU-DEPOT/`

## Mise à jour d’une V1 déjà publiée

Remplacer tous les anciens fichiers par ceux de la V2, sans conserver l’ancien `sw.js` ou `service-worker.js`. GitHub Pages republiera le site. Sur un téléphone ayant déjà ouvert la V1, fermer puis rouvrir l’application. En cas d’affichage persistant de la V1, recharger la page une fois dans le navigateur.

## Installation sur téléphone

- iPhone / Safari : bouton Partager → `Sur l’écran d’accueil`.
- Android / Chrome : menu → `Installer l’application`.

L’application doit être ouverte une première fois avec une connexion afin que le service worker place les ressources en cache.

## Données et confidentialité

Aucun compte n’est requis. La progression est enregistrée uniquement dans `localStorage` sur l’appareil. Aucun GPS, serveur ou service tiers n’est nécessaire au jeu.

## Repères historiques

Les sources officielles sont accessibles depuis `Aide → Repères historiques et sources` dans l’application.
