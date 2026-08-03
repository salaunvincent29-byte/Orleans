# La chronique perdue de Jeanne d’Arc

PWA statique, sans serveur ni base de données, conçue pour un jeu de piste familial à Orléans.

## Mise en ligne sur GitHub Pages

1. Décompresser le ZIP.
2. Créer un dépôt GitHub public ou privé.
3. Copier tous les fichiers **à la racine du dépôt**.
4. Commit et push.
5. Dans GitHub : **Settings → Pages → Deploy from a branch**.
6. Sélectionner la branche `main` et le dossier `/root`.
7. Ouvrir l’adresse fournie par GitHub Pages.

## Test local

Le service worker nécessite HTTP/HTTPS. Ne pas ouvrir directement `index.html` avec `file://`.

```bash
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Fonctionnalités

- 8 missions historiques sur Jeanne d’Arc.
- Progression sauvegardée dans `localStorage`.
- Fonctionnement hors connexion après le premier chargement.
- Mode mission courte et mode adulte.
- Lecture vocale via les fonctions du navigateur.
- Dictée vocale si le navigateur la prend en charge.
- Contraste renforcé.
- Diplôme imprimable.

## Vie privée

Aucune donnée n’est transmise. Les informations restent dans le navigateur de l’appareil.
