# Rapport de tests — PWA V2

Date de validation : 3 août 2026  
Version : 2.0.0

## Résultat global

- **62/62 contrôles statiques réussis** ;
- **31/31 tests de navigation et PWA réussis dans Chromium mobile** ;
- **parcours complet joué automatiquement de bout en bout** ;
- **aucune exception JavaScript détectée** ;
- **rechargement hors connexion validé**.

## Contrôles statiques

Les contrôles couvrent notamment :

- présence de tous les fichiers nécessaires au déploiement ;
- syntaxe JavaScript ;
- validité du manifeste PWA ;
- validité XML des neuf illustrations SVG ;
- présence des huit missions et des seize séquences ludiques ;
- cohérence du cache hors connexion ;
- chemins relatifs compatibles avec GitHub Pages ;
- styles de contraste, réduction des animations et impression du diplôme ;
- dimensions minimales des principales commandes tactiles.

Le détail est conservé dans `tests/test-results.txt`.

## Tests dans Chromium

Le test mobile automatisé a vérifié :

- l’accueil et la création du profil ;
- le prologue et la carte des huit missions ;
- l’ouverture des deux micro-jeux de chaque mission ;
- le système de courage ;
- l’assemblage des huit fragments ;
- la génération du diplôme ;
- l’enregistrement et le contrôle du service worker ;
- le rechargement de l’application sans connexion.

Le détail est conservé dans `tests/browser-results.txt`.

## Test intégral de la partie

Un second test a réellement résolu les mini-jeux dans l’ordre :

1. puzzle de la statue et choix de l’équipement ;
2. décodage du mot `AIDER` et vrai/faux historique ;
3. choix de la route et résolution du labyrinthe ;
4. puzzle du vitrail et détection de l’anachronisme ;
5. classement histoire/mémoire et conseil des habitants ;
6. reproduction de la séquence et énigme du nombre 29 ;
7. bingo et rapport des éclaireurs ;
8. memory des objets et reconstitution du 29 avril 1429 ;
9. assemblage final de la chronique ;
10. génération du diplôme avec huit sceaux et huit objets.

Le détail est conservé dans `tests/full-game-results.txt`.

## Vérification visuelle

Les vues mobiles de l’accueil, de la carte et du diplôme ont été rendues en 390 × 844 px. Une anomalie d’affichage des ressources SVG et une navigation inférieure visible sur l’accueil ont été détectées puis corrigées avant la validation finale.
