let pursuer;
let target;

function setup() {
  createCanvas(800, 800);
  pursuer = new Vehicle(100, 100);
  target = new Target(200, 100);
}

function draw() {
  background(0);

  // pursuer = le véhicule poursuiveur, il vise un point devant la cible
  let steering = pursuer.pursue(target);
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
  pursuer.show();

  // lorsque la target atteint un bord du canvas elle ré-apparait de l'autre côté
  target.edges();
  target.update();
  target.show();
}
