import { GAME_BOARD_X_OFFSET, GAME_BOARD_Y_OFFSET } from "./gameLevels.esm.js";
import { Sprite } from "./Sprite.esm.js";

//rozmiar na obrazku oryginalnym
const DIAMOND_ORIGINAL_SIZE = 32;
const NUMBER_OF_DIAMONDS_TYPES = 6;
//rozmiar którego będę chciał użyć w grze 
export const DIAMOND_SIZE = 48;
//ratio rozmiaru
const DIAMOND_ZOOM = DIAMOND_SIZE / DIAMOND_ORIGINAL_SIZE;

//pojedynczy diament będzie w tablicy (cała plansza gry), więc w konstruktorze muszę podać konkretne dane gdzie on się właściwie znajduje
export class Diamond extends Sprite {
  constructor(x, y, row, column, kind, diamondSpriteImage) {
    const offset = {
      x: GAME_BOARD_X_OFFSET,
      y: GAME_BOARD_Y_OFFSET,
    };
  
    super(x,y,DIAMOND_ORIGINAL_SIZE,DIAMOND_ORIGINAL_SIZE,diamondSpriteImage,NUMBER_OF_DIAMONDS_TYPES,offset);

    this.row = row;
    this.column = column;
    this.kind = kind;
//będzie inkrementowany i odpowiedzialny za kasowanie linii tych samych diamentów
    this.match = 0;
  }

  //wywołanie metody draw z klasy bazowej
  draw(){
    super.draw(this.kind,DIAMOND_ZOOM)
  }
}
