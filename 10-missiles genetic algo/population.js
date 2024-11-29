

class Population {
  constructor(m, num) {
    this.mutationRate = m; 
    this.population = new Array(num);
    this.matingPool = []; 
    this.generations = 0; 
    for (let i = 0; i < this.population.length; i++) {
      let position = createVector(width / 2, height + 20);
      this.population[i] = new Rocket(
        position,
        new DNA(),
        this.population.length
      );
    }
  }

  live(os) {
    // For every creature
    for (let i = 0; i < this.population.length; i++) {
      // If it finishes, mark it down as done!
      this.population[i].checkTarget();
      this.population[i].run(os);
    }
  }

  // Did anything finish?
  targetReached() {
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].hitTarget) return true;
    }
    return false;
  }

  // Calculate fitness for each creature
  calcFitness() {
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].calcFitness();
    }
  }

  // Generate a mating pool
  selection() {
    this.matingPool = [];

    // Calculate total fitness of whole population
    let maxFitness = this.getMaxFitness();

   
    for (let i = 0; i < this.population.length; i++) {
      let fitnessNormal = map(
        this.population[i].getFitness(),
        0,
        maxFitness,
        0,
        1
      );
      let n = int(fitnessNormal * 120); 
      for (let j = 0; j < n; j++) {
        this.matingPool.push(this.population[i]);
      }
    }
  }

  // Making the next generation
  reproduction() {
    // Refill the population with children from the mating pool
    for (let i = 0; i < this.population.length; i++) {
      let m = int(random(this.matingPool.length));
      let d = int(random(this.matingPool.length));
      let mom = this.matingPool[m];
      let dad = this.matingPool[d];
      let momgenes = mom.getDNA();
      let dadgenes = dad.getDNA();
      let child = momgenes.crossover(dadgenes);
      child.mutate(this.mutationRate);
      let position = createVector(width / 2, height + 20);
      this.population[i] = new Rocket(position, child, this.population.length);
    }
    this.generations++;
  }

  getGenerations() {
    return this.generations;
  }

  // Find highest fitness for the population
  getMaxFitness() {
    let record = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].getFitness() > record) {
        record = this.population[i].getFitness();
      }
    }
    return record;
  }
}
