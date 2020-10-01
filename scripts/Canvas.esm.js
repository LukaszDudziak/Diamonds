import { Common } from "./Common.esm.js";

//stałe wymiarów canvasa
export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;

//obiekt z dom
const GAME_SCREEN_ID = "js-game-screen";

//klasa canvas
class Canvas extends Common {
  constructor() {
    super(GAME_SCREEN_ID);
    this.configureCanvas();
  }

  //konfiguracja pola canvas
  configureCanvas() {
    //zwraca dwuwymiarowy kontekst renderowania
    this.context = this.element.getContext("2d");
    //przypisanie wysokości i szerokości (nie powinno odbywać się w css)
    this.context.canvas.width = CANVAS_WIDTH;
    this.context.canvas.height = CANVAS_HEIGHT;
    this.context.font = "20px Arial white";
    this.context.fillstyle = "white";
  }
}

export const canvas = new Canvas();
