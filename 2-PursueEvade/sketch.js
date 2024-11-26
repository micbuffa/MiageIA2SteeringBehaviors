let pursuer;
let target;
let sliderVitesseMaxCible;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer = new Vehicle(random(width), random(height));
  target = new Target(random(width), random(height));
}

let oldMousePos;

function draw() {
  background(0);

  // Enlever les commentaires pour
  // cible controlée par souris
  /*
  target.pos.x = mouseX;
  target.pos.y = mouseY;

  
  if(oldMousePos === undefined) {
    oldMousePos = {};
    oldMousePos.pos = createVector(mouseX, mouseY);
    oldMousePos.pos.x = mouseX;
    oldMousePos.pos.y = mouseY;

  }
// vitesse estimées = la différence entre la nouvelle
// pos de la souris et l'ancienne
let v = p5.Vector.sub(target.pos, oldMousePos.pos);

target.vel = v;
*/

  // pursuer = le véhicule poursuiveur, il vise un point devant la cible
  let force = pursuer.pursue(target);
  pursuer.applyForce(force);

  let evadeForce = target.evade(pursuer);
  target.applyForce(evadeForce);  

  // déplacement et dessin du véhicule et de la target
  pursuer.update();
  pursuer.edges();
  pursuer.show();

  // lorsque la target atteint un bord du canvas elle ré-apparait de l'autre côté
  target.edges();
  // mettre en commentaire la ligne suivante
  // si cible controlée à la souris
  target.update();
  target.show();

  
  /*
  oldMousePos.pos.x = target.pos.x;
  oldMousePos.pos.y = target.pos.y;
  */
  
}
