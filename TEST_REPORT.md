# Rapport de tests — V3.1

## Résultat global

- **98 tests structurels sur 98 réussis**
- **Test d’interface Chromium mobile réussi**
- Syntaxe JavaScript de l’application et du service worker validée
- Manifeste PWA, icônes, SVG et cache hors ligne validés
- Archive finale contrôlée après création

## Évolutions contrôlées

- 8 missions conservées
- **2 épreuves actives maximum par monument**
- 1 seule épreuve par monument en mode mission courte
- 7 écrans de transition entre les 8 lieux
- Chaque transition comprend :
  - nom de la destination ;
  - adresse ;
  - durée de marche indicative ;
  - indice narratif sur la suite de la quête ;
  - bouton facultatif vers un itinéraire cartographique ;
  - bouton « Nous sommes arrivés ».

## Test d’interface mobile

Environnement : Chromium headless, viewport 390 × 844 px.

Contrôles réussis :

- création du profil de l’enquêtrice ;
- vérification automatique de 2 épreuves pour chacune des 8 missions ;
- affichage de la transition Place du Martroi → Maison de Jeanne d’Arc ;
- présence du nom, de l’adresse, du temps de marche et de l’indice ;
- ouverture de la mission suivante via « Nous sommes arrivés » ;
- absence de débordement horizontal sur écran mobile.

Le détail machine est disponible dans `tests/browser-smoke-v31.json` et `tests/test-results.txt`.

## Limite du test navigateur

L’environnement bloque les navigations HTTP locales. Les fichiers HTML, CSS et JavaScript ont donc été injectés dans Chromium pour le test d’interface. Le manifeste, le service worker et l’intégrité du cache ont été contrôlés séparément par la suite de tests structurels.
