import { Common, HIDDEN_SCREEN, VISIBLE_SCREEN } from "./Common.esm.js";
import { canvas } from "./Canvas.esm.js";
import { DATALOADED_EVENT_NAME, loader } from "./Loader.esm.js";
import { game } from "./Game.esm.js";
import { media } from "./Media.esm.js";

//tablica przechowująca wszystkie poziomy
const gameLevels = [
  {
    level: 1,
  },
  {
    level: 2,
  },
  {
    level: 3,
  },
];

const LEVEL_SELECT_BUTTON_ID = "level-select__button";
const LEVEL_SELECT_ID = "js-level-select-screen";

class LevelSelect extends Common {
  constructor() {
    super(LEVEL_SELECT_ID);
    //utworzenie buttonów na podstawie wszystkich dostępnych leveli
    gameLevels.forEach((gameLevel) => this.createButton(gameLevel.level));
  }

  //utworzenie przycisku odpowiadającego kolejnym levelom
  createButton(value) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(LEVEL_SELECT_BUTTON_ID);
    button.textContent = value;
    button.value = value;
    //przekazuje w kliku event, czyli ten konkretny button który zostanie kliknięty
    button.addEventListener("click", (event) =>
      this.buttonOnClickHandler(event)
    );
    this.element.appendChild(button);
  }

  buttonOnClickHandler(event) {
    this.changeVisibilityScreen(this.element, HIDDEN_SCREEN);
    //odpalam canvasa
    this.changeVisibilityScreen(canvas.element, VISIBLE_SCREEN);
    //przekazuje do załadowania wartość buttona, oznaczającą który lvl odpalam
    this.loadLevel(event.currentTarget.value);
  }

  loadLevel(level) {
    //ładowanie mediów poprzez utworzony obiekt, obrazu tła gry, sprajta z diamentami
    media.diamondsSprite = loader.loadImage('assets/images/diamonds-transparent.png')
    media.backgroundImage = loader.loadImage(
      "assets/images/levelbackground.png"
    );
    //nasłuch na wydarzenie kończące ładowanie
    window.addEventListener(DATALOADED_EVENT_NAME, () => {
      game.playLevel(level);
    });
  }
}

export const levelSelect = new LevelSelect();
