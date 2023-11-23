/*
  Calcule la projection orthogonale du point a sur le vecteur b
  a et b sont des vecteurs calculés comme ceci :
  let v1 = p5.Vector.sub(a, pos); soit v1 = pos -> a
  let v2 = p5.Vector.sub(b, pos); soit v2 = pos -> b
  */
function findProjection(pos, a, b) {
  let v1 = p5.Vector.sub(a, pos);
  let v2 = p5.Vector.sub(b, pos);
  v2.normalize();
  let sp = v1.dot(v2);
  v2.mult(sp);
  v2.add(pos);
  return v2;
}

class Vehicle {
  constructor(x, y) {
    // position du véhicule
    this.pos = createVector(x, y);
    // vitesse du véhicule
    this.vel = createVector(0, 0);
    // accélération du véhicule
    this.acc = createVector(0, 0);
    // vitesse maximale du véhicule
    this.maxSpeed = 3;
    // force maximale appliquée au véhicule
    this.maxForce = 0.5;
    // rayon du véhicule
    this.r = 16;
  }

  // on fait une méthode applyBehaviors qui applique les comportements
  // seek et avoid
  applyBehaviors(target, obstacles) {
    // TODO quand l'évitement d'obstacles marchera : ajouter une force de séparation entre véhicules...
    let seekForce = this.arrive(target);
    let avoidForce = this.avoid(obstacles);
    //let avoidForce = this.avoidAmeliore(obstacles);

    seekForce.mult(0.2);
    avoidForce.mult(0.2);
    let totalForce = p5.Vector.add(seekForce, avoidForce);
    this.applyForce(totalForce);
  }

  avoid(obstacles) {
    // calcul d'un vecteur ahead devant le véhicule
    // il regarde par exemple 50 frames devant lui
    let ahead = this.vel.copy();
    ahead.normalize();
    ahead.mult(50);

    // TODO ! Voir transparents pour les étapes !

    return createVector(0, 0);
}
/* 
  Version avec deux vecteurs ahead et ahead2 (deux fois plus court) et 
  donc deux zones d'évitement. On adapte aussi en plus ces vecteurs à la vitesse du véhicule
  Plus le véhicule va vite plus il regarde loin...
*/
avoidAmeliore(obstacles) {
  // TODO
  return createVector(0, 0);
}

getClosestObstacle(pos, obstacles) {
  // on parcourt les obstacles et on renvoie celui qui est le plus près du véhicule
  let closestObstacle = null;
  let closestDistance = 1000000000;
  for (let obstacle of obstacles) {
    let distance = pos.dist(obstacle.pos);
    if (closestObstacle == null || distance < closestDistance) {
      closestObstacle = obstacle;
      closestDistance = distance;
    }
  }
  return closestObstacle;
}

arrive(target) {
  // 2nd argument true enables the arrival behavior
  return this.seek(target, true);
}

seek(target, arrival = false) {
  let force = p5.Vector.sub(target, this.pos);
  let desiredSpeed = this.maxSpeed;
  if (arrival) {
    let slowRadius = 100;
    let distance = force.mag();
    if (distance < slowRadius) {
      desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
    }
  }
  force.setMag(desiredSpeed);
  force.sub(this.vel);
  force.limit(this.maxForce);
  return force;
}

// inverse de seek !
flee(target) {
  return this.seek(target).mult(-1);
}

/* Poursuite d'un point devant la target !
   cette methode renvoie la force à appliquer au véhicule
*/
pursue(vehicle) {
  let target = vehicle.pos.copy();
  let prediction = vehicle.vel.copy();
  prediction.mult(10);
  target.add(prediction);
  fill(0, 255, 0);
  circle(target.x, target.y, 16);
  return this.seek(target);
}

evade(vehicle) {
  let pursuit = this.pursue(vehicle);
  pursuit.mult(-1);
  return pursuit;
}

// applyForce est une méthode qui permet d'appliquer une force au véhicule
// en fait on additionne le vecteurr force au vecteur accélération
applyForce(force) {
  this.acc.add(force);
}

update() {
  // on ajoute l'accélération à la vitesse. L'accélération est un incrément de vitesse
  // (accélératiion = dérivée de la vitesse)
  this.vel.add(this.acc);
  // on contraint la vitesse à la valeur maxSpeed
  this.vel.limit(this.maxSpeed);
  // on ajoute la vitesse à la position. La vitesse est un incrément de position, 
  // (la vitesse est la dérivée de la position)
  this.pos.add(this.vel);

  // on remet l'accélération à zéro
  this.acc.set(0, 0);
}

// On dessine le véhicule
show() {
  // formes fil de fer en blanc
  stroke(255);
  // épaisseur du trait = 2
  strokeWeight(2);

  // formes pleines en blanc
  fill(255);

  // sauvegarde du contexte graphique (couleur pleine, fil de fer, épaisseur du trait, 
  // position et rotation du repère de référence)
  push();
  // on déplace le repère de référence.
  translate(this.pos.x, this.pos.y);
  // et on le tourne. heading() renvoie l'angle du vecteur vitesse (c'est l'angle du véhicule)
  rotate(this.vel.heading());

  // Dessin d'un véhicule sous la forme d'un triangle. Comme s'il était droit, avec le 0, 0 en haut à gauche
  triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
  // Que fait cette ligne ?
  //this.edges();

  // draw velocity vector
  pop();
  this.drawVector(this.pos, this.vel, color(255, 0, 0));
}

drawVector(pos, v, color) {
  push();
  // Dessin du vecteur vitesse
  // Il part du centre du véhicule et va dans la direction du vecteur vitesse
  strokeWeight(3);
  stroke(color);
  line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
  // dessine une petite fleche au bout du vecteur vitesse
  let arrowSize = 5;
  translate(pos.x + v.x, pos.y + v.y);
  rotate(v.heading());
  translate(-arrowSize / 2, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

// que fait cette méthode ?
edges() {
  if (this.pos.x > width + this.r) {
    this.pos.x = -this.r;
  } else if (this.pos.x < -this.r) {
    this.pos.x = width + this.r;
  }
  if (this.pos.y > height + this.r) {
    this.pos.y = -this.r;
  } else if (this.pos.y < -this.r) {
    this.pos.y = height + this.r;
  }
}
}

class Target extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
  }

  show() {
    push();
    stroke(255);
    strokeWeight(2);
    fill("#F063A4");
    push();
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.r * 2);
    pop();
    pop();
  }
}