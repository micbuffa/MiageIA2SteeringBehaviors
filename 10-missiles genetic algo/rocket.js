

class Rocket {
  constructor(pos, dna, totalRockets) {
    this.acceleration = createVector();
    this.velocity = createVector();
    this.position = pos.copy();
    this.r = 4;
    this.dna = dna;
    this.finishTime = 0; 
    this.recordDist = 10000; 

    this.fitness = 0;
    this.geneCounter = 0;
    this.hitObstacle = false; 
    this.hitTarget = false; 
  }


  calcFitness() {
    if (this.recordDist < 1) this.recordDist = 1;

    this.fitness = 1 / (this.finishTime * this.recordDist);

    // Make the function exponential
    this.fitness = pow(this.fitness, 4);

    if (this.hitObstacle) this.fitness *= 0.1; 
    if (this.hitTarget) this.fitness *= 2; 
  }


  run(os) {
    if (!this.hitObstacle && !this.hitTarget) {
      this.applyForce(this.dna.genes[this.geneCounter]);
      this.geneCounter = (this.geneCounter + 1) % this.dna.genes.length;
      this.update();
      this.obstacles(os);
    }
    if (!this.hitObstacle) {
      this.display();
    }
  }

  // Did I make it to the target?
  checkTarget() {
    let d = dist(
      this.position.x,
      this.position.y,
      target.position.x,
      target.position.y
    );
    if (d < this.recordDist) this.recordDist = d;

    if (target.contains(this.position) && !this.hitTarget) {
      this.hitTarget = true;
    } else if (!this.hitTarget) {
      this.finishTime++;
    }
  }

  // Did I hit an obstacle?
  obstacles(os) {
    for (let i = 0; i < os.length; i++) {
      let obs = os[i];
      if (obs.contains(this.position)) {
        this.hitObstacle = true;
      }
    }
  }

  applyForce(f) {
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    let theta = this.velocity.heading() + PI / 2;
    fill(200, 100);
    stroke(0);
    strokeWeight(1);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);

    rectMode(CENTER);
    fill(0);
    rect(-this.r / 2, this.r * 2, this.r / 2, this.r);
    rect(this.r / 2, this.r * 2, this.r / 2, this.r);

    fill(175);
    beginShape(TRIANGLES);
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape();

    pop();
  }

  getFitness() {
    return this.fitness;
  }

  getDNA() {
    return this.dna;
  }

  stopped() {
    return this.hitObstacle;
  }
}
