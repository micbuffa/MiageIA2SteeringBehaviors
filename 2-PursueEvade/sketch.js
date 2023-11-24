let pursuer;
let target;
let sliderVitesseMaxCible;

function setup() {
  createCanvas(800, 800);
  pursuer = new Vehicle(100, 100);
  target = new Target(200, 100);
  // une boucing ball
  ball = new BouncingBall(random(width), random(height))

  sliderVitesseMaxCible = createSlider(1, 6, 1, 0.1);
}

function draw() {
  background(0);

  // pursuer = le véhicule poursuiveur, il vise un point devant la cible
  let steering = pursuer.pursue(ball);
  pursuer.applyForce(steering);

  // quand le poursuiveur est à une distance < rayon du poursuiveur + rayon de la cible
  // on change la position de la cible et on replace le poursuiveur au centre du canvas
  let d = p5.Vector.dist(pursuer.pos, target.pos);

  if (d < pursuer.r + target.r) {
    target = new Target(random(width), random(height));
    pursuer.pos.set(width / 2, height / 2);
  }

  // déplacement et dessin du véhicule et de la target
  pursuer.update();
  pursuer.edges();
  pursuer.show();

  // lorsque la target atteint un bord du canvas elle ré-apparait de l'autre côté
  target.maxSpeed = sliderVitesseMaxCible.value();

  let forceEvasion = target.evade(pursuer);
  target.applyForce(forceEvasion);

  target.edges();
  target.update();
  target.show();

  ball.show();
  ball.update();
  //ball.edges();
}
