import { Common, HIDDEN_CLASS, VISIBLE_SCREEN } from "./Common.esm.js";

const LOAD_CURRENT_ID = "js-loading-screen-current";
const LOAD_TOTAL_ID = "js-loading-screen-total";
const LOADER_ELEMENT_ID = "js-loading-screen";

export const DATALOADED_EVENT_NAME = "dataLoaded";

class Loader extends Common {
  constructor() {
    //utworzenie thisa na głównym elemencie (screen)
    super(LOADER_ELEMENT_ID);
    this.bindToElements();

    //zmienna określająca czy wszystkie grafiki zostały załadowane
    this.isAllLoaded = true;

    // licznik dla liczby załadowanych obrazków
    this.loadedCounter = 0;
    this.totalCounter = 0;
  }
  //metoda pobierająca dodatkowe elementy
  bindToElements() {
    this.currentElement = this.bindToElement(LOAD_CURRENT_ID);
    this.totalElement = this.bindToElement(LOAD_TOTAL_ID);
  }

  //metoda ładowania obrazków
  loadImage(imageUrl) {
    //pokazyanie wywoływanego elementu
    this.changeVisibilityScreen(this.element, VISIBLE_SCREEN);
    //w momencie gdy obrrazek się ładuje ofc nie wszystkie są załadowane
    this.isAllLoaded = false;
    //a counter dodaje i wyświetla
    this.totalCounter++;
    this.totalElement = this.totalCounter;

    const image = new Image();
    image.src = imageUrl;
    image.addEventListener("load", (event) => this.itemLoaded(event), false);

    return image;
  }
  //ładowanie pojedynczego obiektu
  itemLoaded(event) {
    event.target.removeEventListener(event.type, this.itemLoaded, false);
    this.loadedCounter++;
    //wyświetlanie wartości w loaderze
    this.currentElement.textContent = this.loadedCounter;

    //obsługa zakończenia ładowania się gry
    if (this.loadedCounter === this.totalCounter) {
      this.clearFlags();
      //ukrycie loadera
      this.changeVisibilityScreen(this.element, HIDDEN_CLASS);
      window.dispatchEvent(new CustomEvent(DATALOADED_EVENT_NAME));
    }
  }

  //czyszczenie wartości loadera po załadowaniu
  clearFlags() {
    this.isAllLoaded = true;
    this.loadedCounter = 0;
    this.totalCounter = 0;
  }
}

export const loader = new Loader();
