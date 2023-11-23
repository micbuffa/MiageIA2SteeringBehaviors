let target, vehicle;
let vehicules = [];
let sliderVitesseMax;

// la fonction setup est appelée une fois au démarrage du programme par p5.js
function setup() {
  // on crée un canvas de 800px par 800px
  createCanvas(800, 800);

  // TODO: créer un tableau de véhicules en global
  // ajouter nb vehicules au tableau dans une boucle
  // avec une position random dans le canvas

  // on crée des vehicules à des positions aléatoires
  const nbVehicules = 10;
  for (let i = 0; i < nbVehicules; i++) {
    vehicules.push(new Vehicle(random(width), random(height)));
  }

  // slider pour la vitesse max
  // 1er param min, 2e param max, 3e param valeur par défaut 
  // 4ème param pas (step)
  sliderVitesseMax = createSlider(1, 10, 4);
  sliderForceMax = createSlider(0.1, 1, 0.25, 0.01);
  
  target = createVector(random(width), random(height));

  // Nouvel objet : une cible mouvante qui hérite de
  // véhicule
  target2 = new Target(random(width), random(height));

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

  // Dessine un cercle de rayon 32px à la position de la souris
  // la couleur de remplissage est rouge car on a appelé fill(255, 0, 0) plus haut
  // pas de contours car on a appelé noStroke() plus haut
  circle(target.x, target.y, 32);

  // je déplace et dessine les véhicules
  vehicules.forEach(vehicle => {
    // on force la vitess max à la valeur du slider
    vehicle.maxSpeed = sliderVitesseMax.value();
    vehicle.maxForce = sliderForceMax.value();

    vehicle.applyBehaviors(target2.pos);
    vehicle.update();
    vehicle.edges();
    vehicle.show();

     // on cacule la distance entre le véhicule et la cible
     let dist = p5.Vector.dist(vehicle.pos, target);
     // si la distance est < somme (rayon target + rayon vehicule)
     if(dist < (32+vehicle.r)) {
      // collision, on a atteint la cible
      //vehicle.pos.x = random(width);
      //vehicle.pos.y = random(height);
      target.x = random(width);
      target.y = random(height);
     }
  });

  // je déplace et dessine target2
  target2.update();
  target2.edges();
  target2.show();

  // TODO: boucle sur le tableau de véhicules
  // pour chaque véhicule : seek, update, show


  // draw text at 20, 20 with current heading
  /*
  fill(255);
  noStroke();
  let angle = vehicle.vel.heading();
  let angleDegree = degrees(angle);
  text("heading: " + angleDegree.toFixed(0) + " degrees", 20, 20);
*/
}
function mouseClicked() {
  console.log("mouse clicked");
  let v = new Vehicle(random(width), random(height));
  v.maxSpeed = random(1, 5);
  v.maxForce
  vehicules.push(v);
  vehicle
}
