import { Common, HIDDEN_SCREEN, VISIBLE_SCREEN } from "./Common.esm.js";
import { canvas } from "./Canvas.esm.js";
import { DATALOADED_EVENT_NAME, loader } from "./Loader.esm.js";
import { game } from "./Game.esm.js";
import { media } from "./Media.esm.js";
import { gameLevels } from './gameLevels.esm.js';
import { userData } from "./UserData.esm.js";


const LEVEL_SELECT_BUTTON_ID = "level-select__button";
const LEVEL_SELECT_ID = "js-level-select-screen";

class LevelSelect extends Common {
  constructor() {
    super(LEVEL_SELECT_ID);
  }
  //metoda do tworzenia buttonów lvl, za każdym razem po wejściu do menu lvl będzie najpierw czyściła wyświetlane elementy
  createButtons(){
    while(this.element.firstChild){
      this.element.removeChild(this.element.firstChild)
    }
    //a później utworzy buttony na podstawie wszystkich dostępnych leveli, używam some po to, że w przypadku gdy będę miał np. 10lvl, to program nie sprawdzał każdego, tylko będzie sprawdzał do momentu w którym element zwróci mu true (lub jeśli na takie nie natrafi to do końca tablicy), które zgodnie z dokumentacją przerywa działanie some
    gameLevels.some((gameLevel) => this.createButton(gameLevel.level));
  }

  //utworzenie przycisku odpowiadającego kolejnym levelom
  createButton(value) {
    //sprawdzenie czy taki lvl jest w ogóle dostępny
    if(!userData.checkAvailabilityLevel(value)){
      //tutaj true, które zatrzyma niepotrzebne iteracje some z 17. linijki
      return true
    }

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
    if(media.backgroundImage && media.diamondsSprite && media.backgroundMusic && media.swapSound){
      game.playLevel(level);
      return;
    }
    if(!media.diamondsSprite){
      //ładowanie mediów poprzez utworzony obiekt, obrazu tła gry, sprajta z diamentami
      media.diamondsSprite = loader.loadImage('assets/images/diamonds-transparent.png')
    }

    if(!media.backgroundImage){
        media.backgroundImage = loader.loadImage("assets/images/levelbackground.png");
    }

    if(!media.swapSound){
      media.swapSound = loader.loadSound("assets/sounds/stone_rock_or_wood_moved.mp3");
    }

    if(!media.backgroundMusic){
      media.backgroundMusic = loader.loadSound("assets/sounds/music-background.mp3");
    }
    //nasłuch na wydarzenie kończące ładowanie
    window.addEventListener(DATALOADED_EVENT_NAME, () => game.playLevel(level));
  }
}

export const levelSelect = new LevelSelect();
