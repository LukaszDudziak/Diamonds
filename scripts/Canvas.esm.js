import { Common } from "./Common.esm.js";
import { media } from "./Media.esm.js";
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
    this.context.fillStyle = "white";
  }
  //rysowanie na canvasie
  drawGameOnCanvas(gameState) {
    //rysowanie tła
    this.drawBackgroud();
    //wrysowanie punktów do wygranej
    this.drawPointsToWin(gameState.pointsToWin);
    //wrysowanie punktów gracza za
    this.drawPlayersPoints(gameState.getPlayerPoints());
    //wrysowanie pozostałych ruchów
    this.drawLeftMovement(gameState.getLeftMovement());
  }

  //metoda wyrysowania tła gry
  drawBackgroud() {
    this.context.drawImage(media.backgroundImage, 0, 0);
  }

  drawPointsToWin(pointsToWin) {
    //wypisanie tekstu
    this.context.fillText(`${pointsToWin}`, 520, 92);
  }
  drawPlayersPoints(playerPoints) {
    //wypisanie tekstu
    this.context.fillText(`${playerPoints}`, 520, 163);
  }
  drawLeftMovement(leftMovement) {
    //wypisanie tekstu
    this.context.fillText(`${leftMovement}`, 520, 234);
  }
}

export const canvas = new Canvas();
