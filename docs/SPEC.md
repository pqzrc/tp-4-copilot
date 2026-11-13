# Tetris - spécification

Grille 10x20 ; les 7 pièces classiques avec leurs couleurs standard
(I cyan, O jaune, T violet, S vert, Z rouge, J bleu, L orange).

## Commandes
- gauche / droite : déplacer la pièce ;
- flèche haut : rotation d'un quart de tour horaire ;
- flèche bas : descente rapide (soft drop) ;
- Espace : chute immédiate (hard drop) ;
- P : pause / reprise.

## Règles du jeu
- Détection de collision ; la pièce se fige quand elle ne peut plus descendre.
- Suppression des lignes complètes avec une courte animation.
- Génération des pièces : sac de 7 pièces mélangé (7-bag) pour éviter les longues
  séries, utilisant un RNG injectable (graine) pour des parties reproductibles.
- Game over quand une nouvelle pièce ne peut pas apparaître sans collision ;
  affichage du score final.

## Score et niveau
- Score : 1 ligne 100, 2 lignes 300, 3 lignes 500, 4 lignes 800.
- Niveau +1 toutes les 10 lignes ; vitesse de chute croissante avec le niveau.

## Interface
- Affichage de la pièce suivante et de la position fantôme (ghost) de la pièce
  courante.
- Boutons Start, Pause, Restart.
- Panneau latéral : score, niveau, lignes, pièce suivante.
- Responsive.

## Architecture
- src/core/{grid,piece,scoring,game}.js : logique pure, sans DOM ni canvas.
- src/ui/{renderer,input}.js : rendu canvas et clavier.
- main.js relie les deux.
- Le générateur de pièces accepte une graine (RNG injectable) pour des parties
  reproductibles.
