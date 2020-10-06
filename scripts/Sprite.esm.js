import { canvas } from "./Canvas.esm.js";

//klasa do obsługi sprite
export class Sprite {
  //tworzenie pojedynczego sprite z całego sheeta
  constructor(
    x,
    y,
    width,
    height,
    spritesImage,
    numberOfSprites = 1,
    offset = { x: 0, y: 0 }
  ) {
    //przyda się przy "wygaszaniu" poszczególnych diamentów
    this.alpha = 255;
    this.height = height;
    this.width = width;
    this.offset = offset;
    this.numberOfSprites = numberOfSprites;
    this.spritesImage = spritesImage;
    this.x = x;
    this.y = y;
  }
  //ratio ma tutaj pomóc przy skalowaniu obiektów, jeśli zajdzie taka potrzeba
  draw(numberOfSprites = 0, ratio = 1) {
    if (numberOfSprites > this.numberOfSprites) {
      return;
    }
    if (this.alpha !== 255) {
      canvas.context.globalAlpha = this.alpha / 255;
    }
    //wyrysowanie elementu z sheeta
    canvas.context.drawImage(
      this.spritesImage,
      numberOfSprites * this.width,
      0,
      this.width,
      this.height,
      this.x + this.offset.x,
      this.y + this.offset.y,
      this.width * ratio,
      this.height * ratio
    );

    if (this.alpha !== 255) {
      canvas.context.globalAlpha = 1;
    }
  }
}
