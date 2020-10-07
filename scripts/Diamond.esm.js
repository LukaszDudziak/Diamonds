import { Sprite } from "./Sprite.esm.js";

const DIAMOND_ORIGINAL_SIZE = 32;
const DIAMOND_SIZE = 48;
const NUMBER_OF_DIAMONDS_TYPES = 6;

const DIAMOND_ZOOM = DIAMOND_SIZE / DIAMOND_ORIGINAL_SIZE;

export class Diamond extends Sprite {
  constructor(x, y, row, column, kind, diamondSpriteImage) {
    super();
  }
}
