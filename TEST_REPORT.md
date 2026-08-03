# Rapport de tests — V4.0.0

## Résumé

La PWA « La Bannière disparue » a été contrôlée avant livraison.

- 43 contrôles structurels et PWA réussis sur 43 ;
- syntaxe JavaScript validée avec `node --check` ;
- démarrage et création du profil testés dans Chromium ;
- carte des 8 étapes testée ;
- affichage des 16 jeux contrôlé sur une fenêtre mobile de 390 × 844 px ;
- 7 écrans de transition contrôlés ;
- mode express contrôlé ;
- récompense et finale contrôlées ;
- aucun débordement horizontal détecté sur les 16 écrans de jeu ;
- manifeste, icônes et liste des ressources hors connexion contrôlés ;
- intégrité de l’archive ZIP vérifiée.

## Limite de l’environnement de test

La politique réseau du navigateur de l’environnement bloque l’ouverture d’un serveur local. Les tests d’interface ont donc été exécutés dans Chromium avec les ressources HTML, CSS et JavaScript injectées dans une page de test. Le cache hors connexion a été validé statiquement : le service worker référence tous les fichiers essentiels. Le fonctionnement PWA complet nécessite un contexte HTTPS, fourni par GitHub Pages.

## Fichiers détaillés

- `tests/test-results.txt`
- `tests/browser-smoke.json`
- `tests/browser-all-screens.json`
