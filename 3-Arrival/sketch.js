const nbVehicles = 10;
let vehicles = [];

function setup() {
  createCanvas(800, 800);

  createVehicles(nbVehicles);
}

function createVehicles(nbVehicles) {
  for (let i = 0; i < nbVehicles; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new Vehicle(x, y));
  }
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


  // on parcourt le tableau des véhicules
  vehicles.forEach((vehicle, index) => {
    let steering;

    if (index === 0) {
      // 1er véhicule
      // comportement arrive normal
     steering = vehicle.arrive(target);
    } else {
      // Pour les autres.....
      let newTarget = vehicles[index - 1].pos;
      // le dernier paramètre est la distance derrière le véhicule
      // précédent
      steering = vehicle.arrive(newTarget, 40);
    }

    // On applique la force au véhicule
    vehicle.applyForce(steering);

    // On met à jour la position et on dessine le véhicule
    vehicle.update();
    vehicle.show();
  });
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = ! Vehicle.debug;
  }
}