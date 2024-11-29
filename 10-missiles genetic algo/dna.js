

class DNA {
  constructor(newgenes) {
    // The maximum strength of the forces
    this.maxforce = 0.1;

    if (newgenes) {
      this.genes = newgenes;
    } else {
      this.genes = [];
      for (let i = 0; i < lifetime; i++) {
        let angle = random(TWO_PI);
        this.genes[i] = createVector(cos(angle), sin(angle));
        this.genes[i].mult(random(0, this.maxforce));
      }
    }

    this.genes[0].normalize();
  }

 
  crossover(partner) {
    let child = new Array(this.genes.length);
    // Pick a midpoint
    let crossover = int(random(this.genes.length));
    for (let i = 0; i < this.genes.length; i++) {
      if (i > crossover) child[i] = this.genes[i];
      else child[i] = partner.genes[i];
    }
    let newgenes = new DNA(child);
    return newgenes;
  }

  mutate(m) {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < m) {
        let angle = random(TWO_PI);
        this.genes[i] = createVector(cos(angle), sin(angle));
        this.genes[i].mult(random(0, this.maxforce));

        if (i == 0) this.genes[i].normalize();
      }
    }
  }
}
