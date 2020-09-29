import { Common, HIDDEN_SCREEN, VISIBLE_SCREEN } from "./Common.esm.js";
import { levelSelect } from "./LevelSelect.esm.js";

//properta do skalowania
const SCALE_PROPERTY = "--scale-value";
//stałe zawierające elementy DOM
const START_SCREEN_ID = "js-start-screen";
const START_SCREEN_GAME_BUTTON_ID = "js-start-game";
const START_SCREEN_SETTINGS_BUTTON_ID = "js-settings-button";

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
    const scale = Math.min(width / 640, height / 480);

    //ustawienie aktualnej skali do wartości skali
    document.documentElement.style.setProperty(SCALE_PROPERTY, scale);
  }
}

export const mainMenu = new MainMenu();
