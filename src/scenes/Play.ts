import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;
  isLaunched = false;
  launchSpeed = 3;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    // move player to bottom
    let origin = [320, 450]
    this.spinner = this.add.rectangle(origin[0], origin[1], 50, 50, 0xa38ee7);
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown) {
      this.spinner!.rotation -= delta * this.rotationSpeed;
    }
    if (this.right!.isDown) {
      this.spinner!.rotation += delta * this.rotationSpeed;
    }

    if (this.fire!.isDown && this.spinner) {
      this.spinner.y -= this.launchSpeed * delta;
    }

    if (this.isLaunched) {
      if (this.spinner) {
        this.spinner.y -= this.launchSpeed;
      }
    }
    
    if (this.fire!.isDown) {
      // this.spinner?.y -= 1;
      this.isLaunched = true;
      this.tweens.add({
        targets: this.spinner,
        // y: '-=50', // move up by 50 pixelss
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
      });
    }
    // if (this.spinner?.y >= 0) {
    //   console.log("hello");
    // }
  }
}
