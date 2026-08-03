# Rapport de tests — La Chronique des huit preuves V3

## Résultat général

**Tests réussis : 97/97**  
**Test d’interface Chromium : réussi**  
**Intégrité du futur ZIP : à vérifier après création**

## Couverture fonctionnelle

- démarrage d’une nouvelle aventure ;
- saisie et sauvegarde du prénom ;
- affichage du prologue ;
- carte des huit missions ;
- rendu des **36 épreuves** réparties dans les huit lieux ;
- rendu des **4 manches** du Tribunal final ;
- navigation entre missions, preuves, collection et aide ;
- indices progressifs ;
- mode mission courte ;
- mode adulte ;
- calcul des récompenses et des statistiques ;
- diplôme final imprimable ;
- sauvegarde locale de la progression.

## Moteurs de jeu contrôlés

- choix unique ;
- choix multiple ;
- relevé d’observation ;
- remise en ordre chronologique ;
- classement dans deux à quatre catégories ;
- associations ;
- placement sur carte ;
- puzzle par rotations ;
- mémoire séquentielle ;
- collecte de repères pendant le petit train ;
- sélection visuelle.

Le test Chromium a parcouru les 36 écrans d’épreuve et les quatre écrans finaux. Des interactions correctes ont été exécutées sur sept familles de micro-jeux représentatives.

## PWA et GitHub Pages

- tous les chemins utilisés par l’application sont relatifs ;
- `start_url` et `scope` valent `./` ;
- aucune bibliothèque, police ou ressource externe n’est nécessaire ;
- manifeste JSON valide ;
- icônes PNG valides en 192 × 192 et 512 × 512 ;
- service worker syntaxiquement valide ;
- cache versionné `huit-preuves-v3.0.0` ;
- toutes les ressources déclarées dans le cache existent ;
- fallback vers `index.html` pour la navigation hors connexion ;
- page `404.html` fournie pour GitHub Pages.

## Accessibilité et ergonomie

- interface en français ;
- lien d’évitement ;
- zone principale annoncée aux technologies d’assistance ;
- libellés de navigation et de boutons ;
- commandes tactiles de 52 px ;
- mode contraste renforcé ;
- option de réduction des animations ;
- lecture vocale à la demande ;
- absence de chronomètre et de sanction bloquante ;
- trois niveaux d’indices ;
- mode fatigue conservant une énigme ancrée dans chaque lieu ;
- cinq couples de couleurs principaux contrôlés au-dessus du ratio WCAG AA de 4,5:1.

## Contrôle des données

- aucune géolocalisation ;
- aucun compte ;
- aucun transfert vers un serveur ;
- sauvegarde dans `localStorage` uniquement ;
- réinitialisation disponible dans le mode adulte.

## Limite de l’environnement de test

La politique réseau du navigateur de l’environnement bloque l’ouverture d’un serveur HTTP local (`ERR_BLOCKED_BY_ADMINISTRATOR`). Le test d’interface a donc chargé les fichiers HTML, CSS et JavaScript directement dans Chromium, avec un stockage local simulé. Le fonctionnement du service worker n’a pas pu être testé dans ce navigateur local ; sa syntaxe, la liste du cache, les chemins relatifs et l’existence de toutes les ressources ont été vérifiés automatiquement.

Sur GitHub Pages, le contexte HTTPS répond aux exigences normales d’installation d’une PWA et d’enregistrement du service worker.
