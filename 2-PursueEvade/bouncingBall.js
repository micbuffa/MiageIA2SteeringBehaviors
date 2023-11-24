class BouncingBall extends Target {
    constructor(x, y) {
      super(x, y);
      this.r = 10;
    }

    update() {
        // revient à faire :
        // this.pos.x += this.vel.x;
        // this.pos.y += this.vel.y;
        this.pos.add(this.vel);

        // si on atteint le bord droit, on rebondit
        if(this.pos.x + this.r >= width){
            // on se remet au point de contaxt
            this.pos.x = width - this.r;
            this.vel.x = -this.vel.x;
        }

        if(this.pos.x - this.r  <= 0) {
            this.pos.x = this.r;
            this.vel.x = -this.vel.x;
        }

        if(this.pos.y + this.r >= height){
            this.pos.y = height - this.r;
            this.vel.y = -this.vel.y;
        }

        if(this.pos.y - this.r  <= 0) {
            this.pos.y = this.r;
            this.vel.y = -this.vel.y;
        }
    }
  }