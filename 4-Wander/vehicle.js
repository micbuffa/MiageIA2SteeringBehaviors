class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.2;
    this.r = 16;


    // pour comportement wander
    this.wanderTheta = PI / 2;
    this.displaceRange = 0.3;

    this.path = [];
  }

  wander() {
    // point devant le véhicule
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(100);
    wanderPoint.add(this.pos);

    // on le dessine sous la forme d'une petit cercle rouge
    fill(255, 0, 0);
    noStroke();
    circle(wanderPoint.x, wanderPoint.y, 8);

    // Cercle autour du point
    let wanderRadius = 50;
    noFill();
    stroke(255);
    circle(wanderPoint.x, wanderPoint.y, wanderRadius * 2);

    // on dessine une lign qui relie le vaisseau à ce point
    // c'est la ligne blanche en face du vaisseau
    line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);

    // On va s'occuper de calculer le point vert SUR LE CERCLE
    // il fait un angle wanderTheta avec le centre du cercle
    // l'angle final par rapport à l'axe des X c'est l'angle du vaisseau
    // + cet angle
    let theta = this.wanderTheta + this.vel.heading();

    let x = wanderRadius * cos(theta);
    let y = wanderRadius * sin(theta);

    // maintenant wanderPoint c'est un point sur le cercle
    wanderPoint.add(x, y);

    // on le dessine sous la forme d'un cercle vert
    fill(0, 255, 0);
    noStroke();
    circle(wanderPoint.x, wanderPoint.y, 16);

    // on dessine le vecteur desiredSpeed qui va du vaisseau au poibnt vert
    //stroke(255);
    line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);

    // On a donc la vitesse désirée que l'on cherche qui est le vecteur
    // allant du vaisseau au cercle vert. On le calcule :
    // ci-dessous, steer c'est la desiredSpeed directement !
    let steer = wanderPoint.sub(this.pos);

    steer.setMag(this.maxForce);
    this.applyForce(steer);

    // On déplace le point vert sur le cerlcle (en radians)
    this.displaceRange = 0.3;
    this.wanderTheta += random(-this.displaceRange, this.displaceRange);
  }

  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    fill(0, 255, 0);
    circle(target.x, target.y, 16);
    return this.seek(target);
  }

  arrive(target) {
    // 2nd argument true enables the arrival behavior
    return this.seek(target, true);
  }

  flee(target) {
    return this.seek(target).mult(-1);
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

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    // on rajoute la position courante dans le tableau du chemin
    this.path.push(this.pos.copy());

    // si le tableau a plus de 50 éléments, on vire le plus ancien
    // TODO

  }

  show() {
    // dessin du chemin
    this.path.forEach((p, index) => {
      if (!(index % 3)) {
        stroke(255);
        fill(255);
        circle(p.x, p.y, 1);
      }
    });

    // dessin du vaisseau
    console.log("show")
    stroke(255);
    strokeWeight(2);
    fill(255);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();


  }

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
