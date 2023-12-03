let pursuer;
let target;
let sliderVitesseMaxCible;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer = new Vehicle(random(width), random(height));
  target = new Target(random(width), random(height));
}

function draw() {
  background(0);

  // pursuer = le véhicule poursuiveur, il vise un point devant la cible
  let steering = pursuer.pursue(target);
  pursuer.applyForce(steering);

  // déplacement et dessin du véhicule et de la target
  pursuer.update();
  pursuer.edges();
  pursuer.show();

  // lorsque la target atteint un bord du canvas elle ré-apparait de l'autre côté

  target.edges();
  target.update();
  target.show();
}
