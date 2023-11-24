let vehicle;

function setup() {
  createCanvas(800, 800);
  vehicle = new Vehicle(100, 100);
}

function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);

  // Cible qui suit la souris, cercle rouge de rayon 32
  let target = createVector(mouseX, mouseY);
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  // comportement arrive
  let steering = vehicle.arrive(target);

  // On applique la force au véhicule
  vehicle.applyForce(steering);

  // On met à jour la position et on dessine le véhicule
  vehicle.update();
  vehicle.show();
}