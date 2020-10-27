import { Common, HIDDEN_SCREEN, VISIBLE_SCREEN } from "./Common.esm.js";
import { levelSelect } from "./LevelSelect.esm.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./Canvas.esm.js";

//stałe zawierające elementy DOM
const START_SCREEN_ID = "js-start-screen";
const START_SCREEN_GAME_BUTTON_ID = "js-start-game";
const START_SCREEN_SETTINGS_BUTTON_ID = "js-settings-button";
//properta do skalowania
export const SCALE_PROPERTY = "--scale-value";

//mainmenu rozszerza klasę common
class MainMenu extends Common {
  constructor() {
    //wywołanie konstruktora klasy bazowej
    super(START_SCREEN_ID);
    this.bindToGameElements();
    //ustawienie skalowania obszaru gry zależnie od wielkości okna
    this.resizeGameWindow();
    window.addEventListener("resize", this.resizeGameWindow);
  }
  //przypisanie przycisków menu
  bindToGameElements() {
    const gameStartButton = this.bindToElement(START_SCREEN_GAME_BUTTON_ID);
    const gameSettingsButton = this.bindToElement(
      START_SCREEN_SETTINGS_BUTTON_ID
    );

    //listenery przycisków, użyte zamknięcie w strzałkowej po to, żeby mieć dostęp do wyższego scope
    gameStartButton.addEventListener("click", () => this.showLevelScreen());
    gameSettingsButton.addEventListener("click", () =>
      this.showSettingsScreen()
    );
  }
  //implementacja przycisków
  showLevelScreen() {
    //tworzymy buttony przy odpaleniu ich menu
    levelSelect.createButtons();
    //zmiana widoczności obecnego elementu (przekazanego w super konstruktora)
    this.changeVisibilityScreen(this.element, HIDDEN_SCREEN);
    this.changeVisibilityScreen(levelSelect.element, VISIBLE_SCREEN);
  }

  showSettingsScreen() {
    console.log("Wybór opcji");
  }

  //metoda odpowiedzialna za skalowanie okna gry
  resizeGameWindow() {
    //   utworzenie stałych z destrukturyzacji obiektu, tj. wyciągnięcie z window.innerWidth/window.innerHeigth zmiennych bezpośrednio do innerWidth (pod nazwą width) i innerHeigth(pod nazwą height)
    const { innerWidth: width, innerHeight: height } = window;
    const scale = Math.min(width / CANVAS_WIDTH, height / CANVAS_HEIGHT);

    //ustawienie aktualnej skali do wartości skali
    document.documentElement.style.setProperty(SCALE_PROPERTY, scale);
  }
}

export const mainMenu = new MainMenu();
