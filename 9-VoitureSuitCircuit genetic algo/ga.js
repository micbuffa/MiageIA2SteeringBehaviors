
// Fonctions pour le calcul génétique
// On va créer une nouvelle génération de voitures
function nextGeneration() {
    console.log('next generation');
    
    calculateFitness(end);

    for (let i = 0; i < TOTAL; i++) {
      // Pour la mutation, on choisit un parent au hasard
      population[i] = pickOne();
    }

    // On vide le tableau des voitures
    for (let i = 0; i < TOTAL; i++) {
      savedParticles[i].dispose();
    }
    savedParticles = [];
  }
  
  // On choisit un parent au hasard
  function pickOne() {
    let index = 0;

    // Algorithme de la roulette
    // On tire un nombre r au hasard, par exemple
    // 0.5
    // On parcourt le tableau des voitures en enlevant
    // la fitness à r et on s'arrête dès que r <= 0;
    // la valeur de index est le véhicule choisi
    let r = random(1);
    while (r > 0) {
      r = r - savedParticles[index].fitness;
      index++;
    }
    index--;

    // l'heureux élu !
    let particle = savedParticles[index];
    // TODO implement copy Particle
    // on en fait une copie et on la mute
    let child = new Particle(particle.brain);
    child.mutate();
    return child;
  }
  
  // On calcule la fitness de chaque voiture
  function calculateFitness(target) {
    for (let particle of savedParticles) {
      particle.calculateFitness();
    }
    // Normalize all values
    let sum = 0;
    for (let particle of savedParticles) {
      sum += particle.fitness;
    }
    for (let particle of savedParticles) {
      particle.fitness = particle.fitness / sum;
    }
  }