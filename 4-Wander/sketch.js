let vehicles = [];

function setup() {
  createCanvas(1000, 800);

  const nbVehicles = 1;
  for(let i=0; i < nbVehicles; i++) {
    let vehicle = new Vehicle(100, 100);
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
