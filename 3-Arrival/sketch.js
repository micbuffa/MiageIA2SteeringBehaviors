const nbVehicles = 10;

function setup() {
  createCanvas(800, 800);

  //createVehicles(nbVehicles);
  vehicle =  new Vehicle(random(width), random(height));
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

  // TODO : remplacer le code suivant pour afficher une suite
  // de véhicules qui se suivent en "mode snake"
  // c'est-à-dire en suivant le véhicule précédent et en
  // s'arrêtant à une distance donnée derrière lui.


  // TODO : remplacer ce code par le TODO précédent...
  let steeringForce = vehicle.arrive(target);
  vehicle.applyForce(steeringForce);
  // On met à jour la position et on dessine le véhicule
  vehicle.update();
  vehicle.show();
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}