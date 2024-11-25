let target, vehicle;
let vehicule;
let vitesseMaxSlider, accelerationMaxSlider;
let vehicles = [];

// la fonction setup est appelée une fois au démarrage du programme par p5.js
function setup() {
  // on crée un canvas de 800px par 800px
  createCanvas(800, 800);

  creerDesVehicules(10);

  // TODO: créer un tableau de véhicules en global
  // ajouter nb vehicules au tableau dans une boucle
  // avec une position random dans le canvas

  // La cible est un vecteur avec une position aléatoire dans le canvas
  target = createVector(random(width), random(height));

  // On crée des sliders pour la vitesse max et l'accélération max
  // params = min, max, valeur, pas
  vitesseMaxSlider = createSlider(1, 20, 10, 1);
  vitesseMaxSlider.position(920, 10);
  vitesseMaxSlider.size(80);
  // je crée un label juste devant en X
  let labelVitesseMax = createDiv('Vitesse Max:')
  labelVitesseMax.position(810, 10);
  labelVitesseMax.style('color', 'black');
  labelVitesseMax.style('font-size', '14px');

  accelerationMaxSlider = createSlider(0.1, 2, 0.25, 0.01);
  accelerationMaxSlider.position(920, 40);
  accelerationMaxSlider.size(80);
  // je crée un label juste devant en X
  let labelAccelerationMax = createDiv('Accélération Max:')
  labelAccelerationMax.position(810, 40);
  labelAccelerationMax.style('color', 'black');
  labelAccelerationMax.style('font-size', '14px');
}

function creerDesVehicules(nb) {
  for (let i = 0; i < nb; i++) {
    let v = new Vehicle(random(width), random(height));
    vehicles.push(v);
  }
}

// la fonction draw est appelée en boucle par p5.js, 60 fois par seconde par défaut
// Le canvas est effacé automatiquement avant chaque appel à draw
function draw() {
  // fond noir pour le canvas
  background(0);

  // A partir de maintenant toutes les formes pleines seront en rouge
  fill("red");
  // pas de contours pour les formes.
  noStroke();

  // mouseX et mouseY sont des variables globales de p5.js, elles correspondent à la position de la souris
  // on les stocke dans un vecteur pour pouvoir les utiliser avec la méthode seek (un peu plus loin)
  // du vehicule

  target.x = mouseX;
  target.y = mouseY;

  // Dessine un cercle de rayon 32px à la position de la souris
  // la couleur de remplissage est rouge car on a appelé fill(255, 0, 0) plus haut
  // pas de contours car on a appelé noStroke() plus haut
  circle(target.x, target.y, 32);

  vehicles.forEach(vehicle => {
    // Je regarde la valeur des sliders pour la vitesse max
    // et l'accélération max
    vehicle.maxSpeed = vitesseMaxSlider.value();
    vehicle.maxForce = accelerationMaxSlider.value();

    // je déplace et dessine le véhicule
    vehicle.applyBehaviors(target);
    vehicle.update();
    // Si le vehicule sort de l'écran
    // on le fait réapparaitre de l'autre côté
    vehicle.edges();
    vehicle.show();

    // On regarde si il y a collision entre le véhicule et la cible
    // On calcule la distance entre la cible et le véhicule
    const dist = p5.Vector.dist(vehicle.pos, target);
    if (dist < (vehicle.r + 16)) {
      // il y a collision, on fait réapparaitre
      // le véhicule aléatoirement ailleurs dans l'écran
      vehicle.pos.x = random(width);
      vehicle.pos.y = random(height);
    }

  })
  // TODO: boucle sur le tableau de véhicules
  // pour chaque véhicule : seek, update, show
}
