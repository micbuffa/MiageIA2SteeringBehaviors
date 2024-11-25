class Target extends Vehicle {
    constructor(x, y) {
      super(x, y);
      //this.vel = p5.Vector.random2D();
      //this.vel.mult(6);
    
    }
  
    show() {
      
      push();

      stroke("white");
      strokeWeight(2);
      fill("pink");
      translate(this.pos.x, this.pos.y);
      circle(0, 0, this.r * 2);

      pop();
    }
  }