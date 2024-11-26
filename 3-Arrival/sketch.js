const nbVehicles = 10;
let target;
let vehicles = [];

function setup() {
  createCanvas(800, 800);

  createVehicles(nbVehicles);

  target = createVector(random(width), random(height));
}

function createVehicles(nb) {
  for(let i = 0; i < nb; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }
}
// appelée 60 fois par seconde
function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);

  // Cible qui suit la souris, cercle rouge de rayon 32
  target.x = mouseX;
  target.y = mouseY;

  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  // si le véhicule touche la cible, on remet la cible
  // à une position aléatoire
  let vehicle = vehicles[0];

  /* code qui permet de changer la cible si le véhicule
  est proche de la cible */
  /*
  const distance = vehicle.pos.dist(target);
  if(distance < (vehicle.r + 16)) {
    target.x = random(width);
    target.y = random(height);
  }
  */

  // TODO : remplacer le code suivant pour afficher une suite
  // de véhicules qui se suivent en "mode snake"
  // c'est-à-dire en suivant le véhicule précédent et en
  // s'arrêtant à une distance donnée derrière lui.

  vehicles.forEach((vehicle, index) => {
    let steeringForce;

    if(index === 0) {
      // on a affaire au premier véhicule ! il suit bien la cible
      // normale rouge
       steeringForce = vehicle.arrive(target);
    } else {
      // on a affaire à un des autres véhicules
      // il suit le véhicule précédent
      let vehiculePrecedent = vehicles[index - 1];
      const distanceEntreVehicules = 60;
      steeringForce = vehicle.arrive(vehiculePrecedent.pos, distanceEntreVehicules);
    }
    
    vehicle.applyForce(steeringForce);
    // On met à jour la position et on dessine le véhicule
    vehicle.update();
    vehicle.show();
  });

  
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}