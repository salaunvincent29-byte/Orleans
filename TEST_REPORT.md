# Rapport de validation — version 1.0.0

## Contrôles réussis

- Syntaxe JavaScript validée par `node --check`.
- Manifeste JSON valide.
- Présence et dimensions des icônes 192 × 192 et 512 × 512.
- Cohérence des huit missions et des huit fragments.
- Présence des fonctions de sauvegarde locale, lecture vocale, mode mission courte et mode adulte.
- Vérification des ressources déclarées dans le cache hors connexion.
- Vérifications HTML statiques : langue, viewport mobile, région principale et zone dynamique accessible.
- Vérification des chemins relatifs compatibles avec GitHub Pages.
- Vérification HTTP locale des ressources essentielles.

## Limite de l’environnement de test

Le moteur Chromium headless disponible dans l’environnement d’exécution ne termine pas son processus de rendu, malgré le chargement correct des ressources par serveur HTTP. Le contrôle visuel automatisé par capture d’écran n’a donc pas pu être exploité. Les contrôles de syntaxe, de structure, de cohérence fonctionnelle et de ressources ont tous réussi.

## Test conseillé après publication

Ouvrir l’URL GitHub Pages sur le téléphone utilisé pour la visite, commencer une partie test, fermer puis rouvrir l’application pour vérifier la reprise, puis activer le mode avion afin de confirmer l’accès hors connexion.
