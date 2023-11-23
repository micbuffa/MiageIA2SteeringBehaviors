class Path {
  constructor() {
    // Rayon arbitraire de 20 (c'est la demi-largeur de la route)
    // Un chemin a un rayon qui définit la zone ou le véhicule doit rester
    this.radius = 20;
    // Path = tableau de points (vecteurs)
    this.points = [];
  }

  // Ajout d'un point dans le chemin
  addPoint(x, y) {
    let point = createVector(x, y);
    this.points.push(point);
  }

  // Dessin du chemin
  display() {
    // bords arrondis dans les irages
    strokeJoin(ROUND);

    // couleur de la route = gris
    stroke(175);
    // On dessine le chemin deux fois plus large que la droite qui relie deux points
    strokeWeight(this.radius * 2);
    // pas de contours
    noFill();

    // dessin du chemin
    beginShape();
    for (let v of this.points) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE); // CLOSE signifie : on relie le dernier point au premier

    // Draw thin line for center of path
    // couleur noire fil de fer
    stroke(0);
    // épaisseur 1 pixel
    strokeWeight(1);
    noFill();
    beginShape();
    for (let v of this.points) {
      vertex(v.x, v.y);
    }

    endShape(CLOSE);
  }
}
