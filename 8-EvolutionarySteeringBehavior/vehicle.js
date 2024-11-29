// Daniel Shiffman
// The Coding Train
// Coding Challenge 69: Steering Evolution
// Part 1: https://youtu.be/flxOkx0yLrY
// Part 2: https://youtu.be/XaOVH8ZSRNA
// Part 3: https://youtu.be/vZUWTlK7D2Q
// Part 4: https://youtu.be/ykOcaInciBI
// Part 5: https://youtu.be/VnFF5V5DS8s

// https://editor.p5js.org/codingtrain/sketches/xgQNXkxx1

var mr = 0.01;

class Vehicle {
  constructor(x, y, dna) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 4;
    this.maxspeed = 5;
    this.maxforce = 0.5;

    // La vie, à zéro le véhicule est mort
    this.health = 1;

    // 4 gènes : poids de la force d'attraction vers la nourriture, 
    //           poids  de la force d'attraction vers le poison, 
    //           perception de la nourriture (rayon cercle de détection), 
    //           perception du poison (rayon cercle de détection)
    this.dna = [];
    if (dna === undefined) {
      // Food weight
      this.dna[0] = random(-2, 2);
      // Poison weight
      this.dna[1] = random(-2, 2);
      // Food perception
      this.dna[2] = random(0, 100);
      // Poison Percepton
      this.dna[3] = random(0, 100);
    } else {
      // Mutation lors d'un clonage, on va recréer 
      // un individu avec des gènes légèrement modifiés
      this.dna[0] = dna[0];
      if (random(1) < mr) {
        this.dna[0] += random(-0.1, 0.1);
      }
      this.dna[1] = dna[1];
      if (random(1) < mr) {
        this.dna[1] += random(-0.1, 0.1);
      }
      this.dna[2] = dna[2];
      if (random(1) < mr) {
        this.dna[2] += random(-10, 10);
      }
      this.dna[3] = dna[3];
      if (random(1) < mr) {
        this.dna[3] += random(-10, 10);
      }
    }
  }


  // Method to update location
  update() {

    // 60 fois par seconde, on perd de la vie, d'où la 
    // nécessité de se nourrir.
    // à chaque frame on perd 0.005 de vie, donc à 60 images par
    // seconde, on perd 0.3 de vie par seconde
    this.health -= 0.005;

    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  behaviors(good, bad) {
    // G = good (food)
    // B = bad (poison)
    // steerG = force qui attire vers la nourriture
    // steerB = force qui repousse du poison
    const steerG = this.eat(good, 0.2, this.dna[2]);
    const steerB = this.eat(bad, -1, this.dna[3]);

    // on applique les poids des gènes
    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    // on applique les forces
    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  clone() {
    // 2% de chances de clonage
    if (random(1) < 0.002) {
      return new Vehicle(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  }

  // comportement de recherche de nourriture
  // nutrition peut être positive (nourriture) ou négative (poison)
  // perception est le rayon de détection de la nourriture 
  // ou du poison
  eat(list, nutrition, perception) {
    let record = Infinity;
    let closest = null;

    // on parcourt la liste des éléments à manger
    // on cherche le plus proche
    for (let i = list.length - 1; i >= 0; i--) {
      const d = this.position.dist(list[i]);

      // si l'élément est à portée
      // on le mange et on gagne de la vie ou on en perd
      // selon que c'est de la nourriture ou du poison
      // on a pris this.maxspeed qui vaut 5 ici pour la distance
      // à partir de laquelle on mange l'élément. On aurait pu
      // definir une nouvelle variable
      if (d < 5) {
        list.splice(i, 1);
        this.health += nutrition;
      } else {
        // si l'élément n'est pas à portée, 
        // on cherche le plus proche
        if (d < record && d < perception) {
          // on garde en mémoire la distance et l'élément
          record = d;
          closest = list[i];
        }
      }
    }

    // This is the moment of eating!
    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    const desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
    //this.applyForce(steer);
  }

  dead() {
    return (this.health < 0)
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    const angle = this.velocity.heading() + PI / 2;

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if (debug.checked()) {
      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
      line(0, 0, 0, -this.dna[0] * 25);
      strokeWeight(2);
      ellipse(0, 0, this.dna[2] * 2);
      stroke(255, 0, 0);
      line(0, 0, 0, -this.dna[1] * 25);
      ellipse(0, 0, this.dna[3] * 2);
    }

    const gr = color(0, 255, 0);
    const rd = color(255, 0, 0);
    // couleur qui varie en fonction de la santé de l'individu
    // lerpColor est une fonction p5 qui permet de faire une interpolation linéaire
    // entre deux couleurs. Ici on fait une interpolation linéaire entre la couleur rouge
    // et la couleur verte en fonction de la santé de l'individu
    const col = lerpColor(rd, gr, this.health);

    fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();
  }


  // Exerce une force renvoyant vers le centre du canvas si le véhicule s'approche
  // des bords du canvas
  boundaries() {
    const d = 25;

    let desired = null;

    // si le véhicule est trop à gauche ou trop à droite
    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      const steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }
}