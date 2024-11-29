function pldistance(p1, p2, x, y) {
    const num = abs((p2.y - p1.y) * x - (p2.x - p1.x) * y + p2.x * p1.y - p2.y * p1.x);
    const den = p5.Vector.dist(p1, p2);
    return num / den;
  }
  
  class Particle {
    constructor(brain) {
      // nombre de checkpoints passés
      this.fitness = 0;
      this.dead = false;
      this.finished = false;
      this.pos = createVector(start.x, start.y);
      this.vel = createVector();
      this.acc = createVector();
      this.maxspeed = 5;
      this.maxforce = 0.2;
      this.sight = SIGHT;
      this.rays = [];
      this.index = 0;
      this.counter = 0;
  
      // On créer des rayns tous les 15°, entre -45° et 45°
      // on a un angle de vision de 90°
      for (let a = -45; a < 45; a += 15) {
        this.rays.push(new Ray(this.pos, radians(a)));
      }

      let length = this.rays.length;

      // On crée le "cerveau" de la voiture
      // C'est un réseau de neurones
      // qui va prendre des décisions en fonction
      // de ce que la voiture voit
      if (brain) {
        this.brain = brain.copy();
      } else {
        // On créer un réseau de neurones, le nombre de neurones
        // en entrée est égal au nombre de rayons
        // le nombre de neurones en sortie est égal à 2
        // car on a 2 sorties, la direction et la vitesse
        // On a un seul layer caché
        // On a donc 2 layers
        // Le nombre de neurones dans le layer caché est égal
        // au nombre de neurones en entrée * 2
        // On a donc 2 layers de length neurones
        // si length vaut 9 par exemple, on a 9 neurones en entrée
        // On a donc 18 neurones en tout
        // On a donc 18 * 18 + 18 = 342 poids
        // On a donc 342 + 18 = 360 biais
        // On a donc 360 + 342 = 702 paramètres
        this.brain = new NeuralNetwork(this.rays.length, this.rays.length * 2, 2);
      }
    }
  
    dispose() {
      this.brain.dispose();
    }
  
    // Applique une mutation à l'ADN (réseau de neurones) de la voiture courante
    mutate() {
      this.brain.mutate(MUTATION_RATE);
    }
  
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      if (!this.dead && !this.finished) {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.acc.set(0, 0);

        // On incrémente le compteur
        // si on dépasse le temps de vie
        // on meurt, on tue la voiture
        this.counter++;
        if (this.counter > LIFESPAN) {
          this.dead = true;
        }
  
        // on a fait déplacer et tourner la voiture, on va
        // aussi faire tourner les rayons
        for (let i = 0; i < this.rays.length; i++) {
          this.rays[i].rotate(this.vel.heading());
        }
      }
    }
  
    // On vérifie si on a atteint le checkpoint, ou si on a atteint
    // la fin du circuit
    check(checkpoints) {
      if (!this.finished) {
        // On a pas fait un tout complet, on regarde quel est le checkpoint courant
        this.goal = checkpoints[this.index];

        // Est-ce qu'on a atteint le checkpoint ?
        const d = pldistance(this.goal.a, this.goal.b, this.pos.x, this.pos.y);
        if (d < 5) {
          // Si on l'a atteint, on passe au checkpoint suivant
          this.index = (this.index + 1) % checkpoints.length;
          // et on augmente la fitness, c'est le nombre de checkpoint parcourus
          this.fitness++;
          this.counter = 0;
        }
      }
    }
  
    // Ajustage de la fonction de fitness
    calculateFitness() {
      // on met la fitness au carré, pour voir si ça marche mieux
      this.fitness = pow(2, this.fitness);

      // On pourrait booster la fitness si on a fini le circuit....
      // if (this.finished) {
      // } else {
      //   const d = p5.Vector.dist(this.pos, target);
      //   this.fitness = constrain(1 / d, 0, 1);
      // }
    }
  
    // C'est LE comportement de la voiture,
    // elle va regarder autour d'elle et prendre des décisions
    // en fonction de ce qu'elle voit
    // Elle va ensuite appliquer une force pour se diriger
    // vers le checkpoint suivant
    // Elle va aussi éviter les murs
    look(walls) {

      // Lancement des rayons
      // On va regarder autour de nous
      // pour voir si on a des murs
      // On va ensuite prendre des décisions
      // en fonction de ce qu'on voit
      const inputs = [];

      // Pour chaque rayon
      for (let i = 0; i < this.rays.length; i++) {
        const ray = this.rays[i];
        let closest = null;
        let record = this.sight;

        // Pour chaque mur
        for (let wall of walls) {
          // On regarde si le rayon intersecte le mur en question
          const pt = ray.cast(wall);
          if (pt) {
            const d = p5.Vector.dist(this.pos, pt);
            if (d < record && d < this.sight) {
              record = d;
              closest = pt;
            }
          }
        }
  
        // Si on est à moins de 5 pixels d'un mur, on meurt
        if (record < 5) {
          this.dead = true;
        }
  
        // On met la couche de neurone en entrée avec des valeurs entre 0 et 1
        // Rappel, on a i rayons (on est dans une boucle for sur les rayons
        // et on a une couche d'entrée avec autant de neuronnes que de rayons
        inputs[i] = map(record, 0, 50, 1, 0);
  
        // Si on a touché au moins un mur
        if (closest) {
          // colorMode(HSB);
          // stroke((i + frameCount * 2) % 360, 255, 255, 50);
          // stroke(255);
          // line(this.pos.x, this.pos.y, closest.x, closest.y);
        }
      }
      // const vel = this.vel.copy();
      // vel.normalize();
      // inputs.push(vel.x);
      // inputs.push(vel.y);

      // On demande au réseau de neurones de prédire la prochaine action
      // output est un tableau à deux dimensions, deux neurones en sortie
      // output[0] est la direction
      // output[1] est la vitesse
      
      const output = this.brain.predict(inputs);
      let angle = map(output[0], 0, 1, -PI, PI);
      let speed = map(output[1], 0, 1, 0, this.maxspeed);
      // angle = this.vel.heading() + angle;
      angle += this.vel.heading();

      // Calcul de la force à appliquer
      // On calcule un vecteur à partir de l'angle et de la vitesse
      // c'est la vitesse souhaitée
      const steering = p5.Vector.fromAngle(angle);
      steering.setMag(speed);

      // force = vitesse souhaitée - vitesse actuelle
      steering.sub(this.vel);

      // On limite la force
      steering.limit(this.maxforce);
      // On applique la force
      this.applyForce(steering);
      // console.log(output);
    }
  
    // Si la voiture sort du canvas, on la tue
    bounds() {
      if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
        this.dead = true;
      }
    }
  
    // Dessin de la voiture
    show() {
      push();
      translate(this.pos.x, this.pos.y);
      const heading = this.vel.heading();
      rotate(heading);
      fill(255, 100);
      rectMode(CENTER);
      rect(0, 0, 10, 5);
      pop();
      // for (let ray of this.rays) {
      //   // ray.show();
      // }
      // if (this.goal) {
      //   this.goal.show();
      // }
    }
  
    // Met en surbrillance la voiture
    highlight() {
      push();
      translate(this.pos.x, this.pos.y);
      const heading = this.vel.heading();
      rotate(heading);
      stroke(0, 255, 0);
      fill(0, 255, 0);
      rectMode(CENTER);
      rect(0, 0, 20, 10);
      pop();
      for (let ray of this.rays) {
        ray.show();
      }
      if (this.goal) {
        this.goal.show();
      }
    }
  }