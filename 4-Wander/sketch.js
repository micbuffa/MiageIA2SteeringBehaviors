let vehicle;

function setup() {
  createCanvas(800, 600);
  vehicle = new Vehicle(100, 100);
}

function draw() {
  background(0);

  vehicle.wander();

  vehicle.update();
  vehicle.show();
  vehicle.edges();
}
