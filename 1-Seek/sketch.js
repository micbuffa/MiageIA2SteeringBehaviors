let target, vehicle;

// la fonction setup est appelée une fois au démarrage du programme par p5.js
function setup() {
  // on crée un canvas de 800px par 800px
  createCanvas(800, 800);
  // on crée un véhicule à la position (100, 100)
  vehicle = new Vehicle(100, 100);

  // TODO: créer un tableau de véhicules en global
  // ajouter nb vehicules au tableau dans une boucle
  // avec une position random dans le canvas
}

// la fonction draw est appelée en boucle par p5.js, 60 fois par seconde par défaut
// Le canvas est effacé automatiquement avant chaque appel à draw
function draw() {
  // fond noir pour le canvas
  background(0);

  // A partir de maintenant toutes les formes pleines seront en rouge
  fill(255, 0, 0);
  // pas de contours pour les formes.
  noStroke();

  // mouseX et mouseY sont des variables globales de p5.js, elles correspondent à la position de la souris
  // on les stocke dans un vecteur pour pouvoir les utiliser avec la méthode seek (un peu plus loin)
  // du vehicule
  target = createVector(mouseX, mouseY);

  // Dessine un cercle de rayon 32px à la position de la souris
  // la couleur de remplissage est rouge car on a appelé fill(255, 0, 0) plus haut
  // pas de contours car on a appelé noStroke() plus haut
  circle(target.x, target.y, 32);

  vehicle.seek(target);
  vehicle.update();
  vehicle.show();

  // TODO: boucle sur le tableau de véhicules
  // pour chaque véhicule : seek, update, show


  // draw text at 20, 20 with current heading
  fill(255);
  noStroke();
  let angle = vehicle.vel.heading();
  let angleDegree = degrees(angle);
  text("heading: " + angleDegree.toFixed(0) + " degrees", 20, 20);


}
