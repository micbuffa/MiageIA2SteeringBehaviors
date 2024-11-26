let vehicles = [];
let imageFusee;

function preload() {
  // on charge une image de fusée pour le vaisseau
  imageFusee = loadImage('./assets/vehicule.png');
}

function setup() {
  createCanvas(1000, 800);

  const nbVehicles = 10;
  for(let i=0; i < nbVehicles; i++) {
    let vehicle = new Vehicle(100, 100, imageFusee);
    vehicles.push(vehicle);
  }

  // On cree des sliders pour régler les paramètres
  creerSliders();
}

function creerSliders() {
  // paramètres de la fonction custom de création de sliders :
  // label, min, max, val, step, posX, posY, propriete des véhicules
  creerUnSlider("Rayon du cercle", 10, 200, 50, 1, 10, 20, "wanderRadius");
  creerUnSlider("Distance du cercle", 10, 400, 100, 1, 10, 40, "distanceCercle");
/*
  // On crée un slider pour la distance du cercle par rapport au vaisseau
  // min, max, valeur, pas
  let distCercleSlider = createSlider(10, 200, 50, 1);
  
  // label pour le slider
  let distCercleLabel = createP("Distance du cercle");
  distCercleLabel.position(10, 5);
  // couleur blanche
  distCercleLabel.style('color', 'white');

  distCercleSlider.position(140, 20);
  // on affiche la valeur du slider à droite du slider
  let distCercleValue = createSpan(distCercleSlider.value());
  distCercleValue.position(300, 20);
  distCercleValue.style('color', 'white');
  // on affiche la valeur du slider
  distCercleValue.html(distCercleSlider.value());
  

  distCercleSlider.input(() => {
    vehicles.forEach(vehicle => {
      vehicle.wanderRadius = distCercleSlider.value();
      distCercleValue.html(distCercleSlider.value());
    });
  });
*/
}
function creerUnSlider(label, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);
  
  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');

  slider.position(posX + 150, posY + 17);

  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY+17);
  valueSpan.style('color', 'white');
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    vehicles.forEach(vehicle => {
      vehicle[propriete] = slider.value();
    });
  });

}
function draw() {
  background(0);
  //background(0, 0, 0, 20);

  vehicles.forEach(vehicle => {
    vehicle.wander();

    vehicle.update();
    vehicle.show();
    vehicle.edges();
  });
  
}
