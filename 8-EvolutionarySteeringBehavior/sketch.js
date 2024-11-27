// Daniel Shiffman
// The Coding Train
// Coding Challenge 69: Steering Evolution

// Part 1: https://youtu.be/flxOkx0yLrY
// Part 2: https://youtu.be/XaOVH8ZSRNA
// Part 3: https://youtu.be/vZUWTlK7D2Q
// Part 4: https://youtu.be/ykOcaInciBI
// Part 5: https://youtu.be/VnFF5V5DS8s

const vehicles = [];
const food = [];
const poison = [];

let debug;

function setup() {
  createCanvas(640, 360);

  // 50 véhicules par défaut
  for (let i = 0; i < 50; i++) {
    const x = random(width);
    const y = random(height);
    vehicles[i] = new Vehicle(x, y);
  }

  // 40 éléments de nourriture au départ
  for (let i = 0; i < 40; i++) {
    const x = random(width);
    const y = random(height);
    food.push(createVector(x, y));
  }

  // 20 éléments de poison au départ
  for (let i = 0; i < 20; i++) {
    const x = random(width);
    const y = random(height);
    poison.push(createVector(x, y));
  }

  debug = createCheckbox();
}

function mouseDragged() {
  vehicles.push(new Vehicle(mouseX, mouseY));
}

function draw() {
  background(0);

  // On fait apparaitre aléatoirement de la nourriture
  if (random(1) < 0.1) {
    const x = random(width);
    const y = random(height);
    food.push(createVector(x, y));
  }

  // On fait apparaitre aléatoirement du poison
  if (random(1) < 0.01) {
    const x = random(width);
    const y = random(height);
    poison.push(createVector(x, y));
  }

  // on dessine la nourriture
  for (let i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 4, 4);
  }

  // on dessine le poison
  for (let i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 4, 4);
  }

  // On parcourt la liste à l'envers pour pouvoir supprimer
  // des éléments sans problème. Astuce connue...
  for (let i = vehicles.length - 1; i >= 0; i--) {
    // Comportement "confinement" dans le canvas (les vehicules
    // ne peuvent pas sortir de l'écran, ils sont repoussés
    // par les bords)
    vehicles[i].boundaries();

    // attirés par la nourriture et repoussés par le poison
    vehicles[i].behaviors(food, poison);

    vehicles[i].update();
    vehicles[i].display();

    // 0.002% de chances de clonage dans cette fonction
    // voir le code de clone() dans vehicule.js
    const newVehicle = vehicles[i].clone();

    // si par chance le véhicule a été cloné
    // plus sa durée de vie est grande, plus il a de
    // chances d'être cloné....
    if (newVehicle != null) {
      vehicles.push(newVehicle);
    }

    // Si le véhicule est mort, alors on le retire du tableau
    // et on ajoute un élément food à sa position
    if (vehicles[i].dead()) {
      const x = vehicles[i].position.x;
      const y = vehicles[i].position.y;
      food.push(createVector(x, y));
      vehicles.splice(i, 1);
    }

  }
}
