import { Common, VISIBLE_SCREEN } from "./Common.esm.js";
import { DATALOADED_EVENT_NAME, loader } from "./Loader.esm.js";
import { gameLevels } from "./gameLevels.esm.js";
import { canvas } from "./Canvas.esm.js";

const gameState = {
  pointsToWin: 7000,
  getPlayerPoints: () => 1000,
  getLeftMovement: () => 20,
};

class Game extends Common {
  constructor() {
    super();
  }
  //uruchomienie rozgrywania pojedynczego lvl
  playLevel(level) {
    window.removeEventListener(DATALOADED_EVENT_NAME, this.playLevel);
    //przypisanie info z tablicy leveli
    const levelInfo = gameLevels[level - 1];
    //ustawienie widoczności elementu canvas
    this.changeVisibilityScreen(canvas.element, VISIBLE_SCREEN);
    this.animate();
  }

  //metoda animacji
  animate() {
    canvas.drawGameOnCanvas(gameState);
    this.animationFrame = window.requestAnimationFrame(() => this.animate());
  }
}

export const game = new Game();
