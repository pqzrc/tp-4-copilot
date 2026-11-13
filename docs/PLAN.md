# Plan de realisation Tetris (5 etapes testables)

## Etape 1 - Contrat des pieces (source unique)
Objectif:
- Faire de [src/core/piece.js](../src/core/piece.js) la source unique des pieces (matrices) et de la rotation.

Travail:
- Conserver/exporter `PIECES` et `rotate`.
- Ajouter/exporter `PIECE_NAMES = Object.keys(PIECES)` pour eviter toute duplication ailleurs.
- Verrouiller les tests de rotation et de structure des pieces dans [tests/piece.test.js](../tests/piece.test.js).

Tests de validation:
- 3 tests rotate: matrice 2x2, matrice 3x3, matrice non carree (erreur).
- Test de structure: 7 pieces presentes et noms attendus.

Definition of done:
- `npx vitest run` passe sur [tests/piece.test.js](../tests/piece.test.js).

## Etape 2 - Moteur de grille pur
Objectif:
- Implementer la logique de plateau 10x20 sans DOM ni canvas.

Travail:
- Creer [src/core/grid.js](../src/core/grid.js) avec:
  - `createGrid(rows, cols)`
  - `isValidPosition(grid, matrix, row, col)`
  - `lockPiece(grid, matrix, row, col)`
  - `clearLines(grid)`
  - `isGameOver(grid)`

Tests de validation:
- Cas collisions bords/gauche/droite/bas.
- Verrouillage correct des cellules.
- Suppression de lignes (1 a 4).
- Detection game over.

Definition of done:
- `npx vitest run` passe sur [tests/grid.test.js](../tests/grid.test.js).

## Etape 3 - Score, niveau, vitesse
Objectif:
- Isoler le bareme dans un module pur.

Travail:
- Creer [src/core/scoring.js](../src/core/scoring.js) avec:
  - `scoreForLines(lines)`
  - `levelForLines(lines)`
  - `speedForLevel(level)`

Tests de validation:
- Bareme: 1=100, 2=300, 3=500, 4=800.
- Niveaux: +1 toutes les 10 lignes.
- Vitesse decroissante avec plancher.

Definition of done:
- `npx vitest run` passe sur [tests/scoring.test.js](../tests/scoring.test.js).

## Etape 4 - Orchestration de partie (core)
Objectif:
- Assembler les regles de jeu dans un moteur central.

Travail:
- Creer [src/core/game.js](../src/core/game.js) avec une classe de partie:
  - spawn, move, rotatePiece, softDrop, hardDrop, tick
  - pause/reprise/restart
  - 7-bag + RNG injectable (seed)
  - score/lignes/niveau
  - game over si spawn impossible

Tests de validation:
- Deplacements valides/invalides.
- Rotation valide et blocage en collision.
- Soft/hard drop.
- Verrouillage, clear lines, score, niveau.
- Reproductibilite avec seed.

Definition of done:
- `npx vitest run` passe sur [tests/gameManager.test.js](../tests/gameManager.test.js).

## Etape 5 - Integration UI
Objectif:
- Connecter le core a l interface (canvas + clavier + panneau lateral).

Travail:
- Implementer [src/ui/renderer.js](../src/ui/renderer.js) et [src/ui/input.js](../src/ui/input.js).
- Relier dans le point d entree (main/script) pour Start/Pause/Restart.
- Afficher ghost, next piece, score, niveau, lignes.

Tests de validation:
- Tests unitaires de mapping clavier (gauche/droite/haut/bas/espace/P).
- Verification manuelle responsive desktop/mobile.
- Validation e2e minimale: une partie complete jusqu a game over.

Definition of done:
- `npx vitest run` vert + verification manuelle conforme a [docs/SPEC.md](SPEC.md).
