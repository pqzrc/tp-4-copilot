# Journal de bord — TP4 (Tetris + GitHub Copilot)

Pour chaque exercice : ce qui a été demandé, ce que Copilot a produit, ce qui a été gardé ou annulé, le nombre d'itérations.

## Exercice 1 — Prise en main

1. **Complétion** — les 7 tétrominos (`export const PIECES`). Copilot a proposé les matrices ligne par ligne (Tab). Vérifiées à la main : les 7 formes sont correctes, rien à corriger. 1 itération.

2. **Complétion** — `rotate(matrix)` à partir du JSDoc + signature. Corps proposé par la complétion, rotation horaire correcte (testée en terminal). Rien à corriger. 1 itération.

3. **Chat en ligne (Ctrl+I)** — « lève une erreur si la matrice n'est pas carrée ». Diff accepté : ajout du contrôle de matrice carrée + `throw`. Correct. 1 itération.

4. **Ask** — convention d'orientation + forme incorrecte. Convention bien expliquée (1re ligne = haut, rotation horaire), mais « forme incorrecte » a répondu « matrice non carrée » (hors-sujet : c'est la contrainte de `rotate`, pas les tétrominos). Ma propre vérification : les 7 formes sont justes. 1 itération.

5. **Terminal (Ctrl+I)** — initialiser npm + installer vitest. Commande proposée et exécutée, puis ajout manuel de `"type": "module"` et du script `"test": "vitest run"`. 1 itération.

6. **Agent** — `tests/piece.test.js` avec trois tests de `rotate` (2x2, 3x3, non carrée) + lancement. Fichier créé, commande exécutée après accord, sortie lue, tests verts. 2 itérations : le 1er `npm test` a échoué (« Error: no test specified » — le script `test` n'était pas encore dans le package.json utilisé par le terminal) ; l'agent a vérifié le package.json puis relancé avec la bonne commande.

7. **Agent + checkpoint** — « renomme rotate en tourner dans tout le projet ». Fait, puis Restore checkpoint → retour à l'état précédent. Rien gardé. 1 itération.

8. **Commit** — message généré par le Copilot dans l'onglet Source Control, validé, puis `git tag ex1`.
