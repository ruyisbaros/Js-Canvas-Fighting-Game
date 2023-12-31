class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
  }
  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax), // Crop image positions (x1,y1,x2,y2)
      0, // Crop image positions (x1,y1,x2,y2)
      this.image.width / this.framesMax, // Crop image positions (x1,y1,x2,y2)
      this.image.height, // Crop image positions (x1,y1,x2,y2)
      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }
  update() {
    this.draw();
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
}

class Fighter {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    playerPngOffset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.playerPngOffset = playerPngOffset;
    this.sprites = sprites;
    this.death = false;

    for (let sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax), // Crop image positions (x1,y1,x2,y2)
      0, // Crop image positions (x1,y1,x2,y2)
      this.image.width / this.framesMax, // Crop image positions (x1,y1,x2,y2)
      this.image.height, // Crop image positions (x1,y1,x2,y2)
      this.position.x - this.playerPngOffset.x,
      this.position.y - this.playerPngOffset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }
  "./assets/kenji/Death.png";
  update() {
    this.draw();
    if (!this.death) {
      this.framesElapsed++;
      if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMax - 1) {
          this.framesCurrent++;
        } else {
          this.framesCurrent = 0;
        }
      }
    }

    //Attack Boxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    //draw attack box

    /* c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    ); */
    //Jumping and movement
    this.position.x += this.velocity.x; //Movement formula
    this.position.y += this.velocity.y; //jumping formula

    //Gravity condition
    if (
      this.position.y + this.height + this.velocity.y >=
      canvas.height - 130
    ) {
      this.velocity.y = 0;
      this.position.y = 296.16;
    } else {
      this.velocity.y += gravity;
    }

    //console.log(this.position.y);
  }

  attack() {
    this.switchSprites("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 1000);
  }

  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprites("death");
    } else {
      this.switchSprites("takeHit");
    }
  }

  switchSprites(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.death = true;
      return;
    }
    switch (sprite) {
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
