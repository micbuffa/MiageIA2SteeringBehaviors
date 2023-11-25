let pursuer;
let target;
let obstacles = [];

function setup() {
  createCanvas(800, 800);
  pursuer = new Vehicle(100, 100);

  // On cree un obstalce au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
  obstacle = new Obstacle(width/2, height/2, 100);
  obstacles.push(obstacle);
}

function draw() {
  background(0);

  target = createVector(mouseX, mouseY);

  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  // dessin des obstacles
  // TODO
  obstacles.forEach(o => {
    o.show();
  })

  // pursuer = le véhicule poursuiveur, il vise un point devant la cible
  let steering = pursuer.applyBehaviors(target, obstacles);
  pursuer.applyForce(steering);

  // déplacement et dessin du véhicule et de la target
  pursuer.update();
  pursuer.show();
}

function mousePressed() {
  obstacle = new Obstacle(mouseX, mouseY, random(5, 60));
  obstacles.push(obstacle);
}