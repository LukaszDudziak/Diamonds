import { Common } from "./Common.esm.js";
import { DATALOADED_EVENT_NAME, loader } from "./Loader.esm.js";
import { gameLevels } from "./gameLevels.esm.js";

class Game extends Common {
  constructor() {
    super();
  }
  //uruchomienie rozgrywania pojedynczego lvl
  playLevel(level) {
    window.removeEventListener(DATALOADED_EVENT_NAME, this.playLevel);
    //przypisanie info z tablicy leveli
    const levelInfo = gameLevels[level - 1];
    this.animate();
  }

  animate() {
    console.log("bla bla bla");
    this.animationFrame = window.requestAnimationFrame(() => this.animate());
  }
}

export const game = new Game();
