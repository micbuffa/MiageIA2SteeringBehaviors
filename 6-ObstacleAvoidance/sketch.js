let pursuer1, pursuer2;
let target;
let obstacles = [];
let vehicules = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer1 = new Vehicle(100, 100);
  pursuer2 = new Vehicle(random(width), random(height));

  vehicules.push(pursuer1);
  //vehicules.push(pursuer2);

  // On cree un obstace au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
  obstacles.push(new Obstacle(width / 2, height / 2, 100, "green"));
}

function draw() {
  // changer le dernier param (< 100) pour effets de trainée
  background(0, 0, 0, 100);

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

  vehicules.forEach(v => {
    // pursuer = le véhicule poursuiveur, il vise un point devant la cible
    v.applyBehaviors(target, obstacles, vehicules);

    // déplacement et dessin du véhicule et de la target
    v.update();
    v.show();
  });
}

function mousePressed() {
  // TODO : ajouter un obstacle de taille aléatoire à la position de la souris
  obstacles.push(new Obstacle(mouseX, mouseY, random(20, 100), "green"));
}

function keyPressed() {
  if (key == "v") {
    vehicules.push(new Vehicle(random(width), random(height)));
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  } else if (key == "f") {
    // on crée 10 véhicules à des position random espacées de 50px
    // en x = 20, y = hauteur du  canvas sur deux
    for (let i = 0; i < 10; i++) {
      let v = new Vehicle(20, 300 )
      // vitesse aléatoire
      v.vel = new p5.Vector(random(1, 5), random(1, 5));
      vehicules.push(v);
    }
  }
}