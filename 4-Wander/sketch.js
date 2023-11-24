let vehicles = [];

function setup() {
  createCanvas(800, 600);

  const nbVehicles = 25
  for(let i=0; i < nbVehicles; i++) {
    vehicle = new Vehicle(100, 100, color(random(255), random(255), random(255)));
    vehicle.maxSpeed = 4;;
    vehicle.maxForce = random(0.1, 0.3);
    vehicle.r = random(8, 24);
    vehicles.push(vehicle);
  }
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
