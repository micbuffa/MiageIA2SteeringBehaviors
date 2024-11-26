const nbVehicles = 10;
let target;
let vehicles = [];
let targets = [];
let mode = "initiales";

// Appelée avant de démarrer l'animation
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  font = loadFont('./assets/inconsolata.otf');
}

function setup() {
  createCanvas(800, 800);

  createTargetsAvecMesIntiales();

  createVehicles(targets.length);

  target = createVector(random(width), random(height));

}

function createTargetsAvecMesIntiales() {
  let points = font.textToPoints('Michel', 80, 260, 235, { sampleFactor:  0.05 });

  // On boucle sur les points et on crée des cibles
  points.forEach((point) => {
    targets.push(createVector(point.x, point.y));
  });

  /* Version manuelle 
  // On fait le M
  // Jambe gauche
  targets.push(createVector(100, 100));
  targets.push(createVector(100, 120));
  targets.push(createVector(100, 140));
  targets.push(createVector(100, 160));
  targets.push(createVector(100, 180));
  targets.push(createVector(100, 200));
  // La descente en V de gauche
  targets.push(createVector(120, 120));
  targets.push(createVector(140, 140));
  // Le point en bas du V
  targets.push(createVector(160, 120));
  // Le remontée V de droite
  targets.push(createVector(180, 100));
  // La jambe de droite
  targets.push(createVector(180, 120));
  targets.push(createVector(180, 140));
  targets.push(createVector(180, 160));
  targets.push(createVector(180, 180));
  targets.push(createVector(180, 200));

  // Le B
  // Jambe gauche
  targets.push(createVector(200, 100));
  targets.push(createVector(200, 120));
  targets.push(createVector(200, 140));
  targets.push(createVector(200, 160));
  targets.push(createVector(200, 180));
  // Le premier "rond" du B
  targets.push(createVector(215, 105));
  targets.push(createVector(225, 115));
  targets.push(createVector(235, 125));
  targets.push(createVector(235, 135));
  targets.push(createVector(225, 145));
  targets.push(createVector(212, 145));
  // le second
  targets.push(createVector(215, 155));
  targets.push(createVector(225, 165));
  targets.push(createVector(235, 175));
  targets.push(createVector(235, 185));
  targets.push(createVector(225, 195));
  targets.push(createVector(212, 195));
  */
}

function createVehicles(nb) {
  for (let i = 0; i < nb; i++) {
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

  // On dessine les cibles avec mes initiales
  targets.forEach((t) => {
    push();
    fill("orange");
    circle(t.x, t.y, 10);
    pop();
  });

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

    if (mode == "snake") {
      vehicle.r = 16;
      if (index === 0) {
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
    } else if (mode == "initiales") {
      steeringForce = vehicle.arrive(targets[index]);
      vehicle.r = 10;
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
  } else if(key === 's') {
    mode = "snake";
  } else if (key === 'i') {
    mode = "initiales";
  } 
}