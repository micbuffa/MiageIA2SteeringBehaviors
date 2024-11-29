

const TOTAL = 100;
const MUTATION_RATE = 0.1;
const LIFESPAN = 25;
const SIGHT = 50;

let generationCount = 0;

// Murs du circuit
let walls = [];
// rayon courant qui part de la voiture
let ray;

// Les voitures
let population = [];
let savedParticles = [];

let start, end;

let speedSlider;

let inside = [];
let outside = [];
let checkpoints = [];
const maxFitness = 500;
let changeMap = false;

/* construit un nouveau circuit */
function buildTrack() {
  checkpoints = [];
  inside = [];
  outside = [];

  let noiseMax = 4;
  const total = 60;
  const pathWidth = 60;
  let startX = random(1000);
  let startY = random(1000);
  for (let i = 0; i < total; i++) {
    let a = map(i, 0, total, 0, TWO_PI);
    let xoff = map(cos(a), -1, 1, 0, noiseMax) + startX;
    let yoff = map(sin(a), -1, 1, 0, noiseMax) + startY;
    let xr = map(noise(xoff, yoff), 0, 1, 100, width * 0.5);
    let yr = map(noise(xoff, yoff), 0, 1, 100, height * 0.5);
    let x1 = width / 2 + (xr - pathWidth) * cos(a);
    let y1 = height / 2 + (yr - pathWidth) * sin(a);
    let x2 = width / 2 + (xr + pathWidth) * cos(a);
    let y2 = height / 2 + (yr + pathWidth) * sin(a);
    checkpoints.push(new Boundary(x1, y1, x2, y2));
    inside.push(createVector(x1, y1));
    outside.push(createVector(x2, y2));
  }
  walls = [];
  for (let i = 0; i < checkpoints.length; i++) {
    let a1 = inside[i];
    let b1 = inside[(i + 1) % checkpoints.length];
    walls.push(new Boundary(a1.x, a1.y, b1.x, b1.y));
    let a2 = outside[i];
    let b2 = outside[(i + 1) % checkpoints.length];
    walls.push(new Boundary(a2.x, a2.y, b2.x, b2.y));
  }

  start = checkpoints[0].midpoint();
  end = checkpoints[checkpoints.length - 1].midpoint();
}

function setup() {
  createCanvas(1200, 800);

  // tensor flow will worj on the cpu
  tf.setBackend('cpu');

  buildTrack();
  // let a = inside[inside.length - 1];
  // let b = outside[outside.length - 1];
  // walls.push(new Boundary(a.x, a.y, b.x, b.y));

  // On crée les véhicules....
  for (let i = 0; i < TOTAL; i++) {
    population[i] = new Particle();
  }

  speedSlider = createSlider(1, 10, 1);
}

function draw() {
  const cycles = speedSlider.value();
  background(0);

  // Par défaut le meilleur candidat est le premier de la population
  let bestP = population[0];

  // Nombre de cyles par frame ("époques par frame")
  for (let n = 0; n < cycles; n++) {
    // Pour chaque voiture
    for (let particle of population) {
      // On applique le comportement
      particle.look(walls);
      // on regarde si on a passé un checkpoint
      particle.check(checkpoints);
      // on vérifie qu'on est pas sorti du circuit
      particle.bounds();

      // classique.... on met à jour accelerations, vitesses et positions
      particle.update();
      // et on dessine
      particle.show();

      // Une fois les voitures déplacées
      // On récupère la meilleure, celle qui a passé le plus de checkpoints
      if (particle.fitness > bestP.fitness) {
        bestP = particle;
      }
    }

    // On syupprime les voitures mortes ou celles qui ont fini le circuit
    for (let i = population.length - 1; i >= 0; i--) {
      const particle = population[i];
      if (particle.dead || particle.finished) {
        savedParticles.push(population.splice(i, 1)[0]);
      }

      // On regarde si on a atteint la fin du circuit, si oui
      // on regenere le circuit
      if (!changeMap && particle.fitness > maxFitness) {
        changeMap = true;
      }
    }

    // Si on a fini le circuit, avec au moins un véhicule
    // on passe à la génération suivante, et on garde la génération actuelle comme point de départ
    if (population.length !== 0 && changeMap) {
      for (let i = population.length - 1; i >= 0; i--) {
        savedParticles.push(population.splice(i, 1)[0]);
      }

      // On reconstruit le circuit
      buildTrack();
      // On complète la génération avec des voitures issues de la génération précédente
      // en appliquant des mutations
      nextGeneration();
      generationCount++;
      changeMap = false;
    }

    // Si jamais on a plus de voitures, on passe à la génération suivante
    // MB: ça me semble inutile, car on a déjà un test pour passer à la génération suivante
    if (population.length == 0) {
      buildTrack();
      nextGeneration();
      generationCount++;
    }
  }

  for (let cp of checkpoints) {
    //strokeWeight(2);
    //cp.show();
  }
  // on dessine les murs
  for (let wall of walls) {
    wall.show();
  }

  // On dessine les voitures
  for (let particle of population) {
    particle.show();
  }

  // On met la voiture la meilleure en surbrillance
  bestP.highlight();

  // on affiche le numéro de la génération
  fill(255);
  textSize(24);
  noStroke();
  text('generation ' + generationCount, 10, 50);

  // ellipse(start.x, start.y, 10);
  // ellipse(end.x, end.y, 10);
}