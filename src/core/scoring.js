// Bareme, niveau et vitesse : logique pure.

export const LINE_SCORES = { 1: 100, 2: 300, 3: 500, 4: 800 };

export function scoreForLines(lines) {
  return LINE_SCORES[lines] ?? 0;
}

// Niveau 1 au depart, +1 toutes les 10 lignes.
export function levelForLines(lines) {
  return Math.floor(lines / 10) + 1;
}

// Vitesse croissante : duree (ms) entre deux chutes.
export function speedForLevel(level) {
  return Math.max(80, 1000 - (level - 1) * 90);
}
