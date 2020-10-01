import { Common, VISIBLE_SCREEN } from "./Common.esm.js";

const LOAD_CURRENT_ID = "js-loading-screen-current";
const LOAD_TOTAL_ID = "js-loading-screen-total";
const LOADER_ELEMENT_ID = "js-loading-screen";

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
  }
}

export const loader = new Loader();
