//klasa utworzona dla powtarzającego się kodu, który pozwoli na obsługę różnych elementów, będzie rozszerzać większość klas

//stałe, które pomogą w togglowaniu klasy hidden, która pozwoli na ukrywanie i wyświetlanie ekranów
export const HIDDEN_CLASS = "hidden";
export const HIDDEN_SCREEN = false;
export const VISIBLE_SCREEN = true;

export class Common {
  constructor(elementId) {
    if (typeof elementId === "undefined") {
      return;
    }
    this.element = this.bindToElement(elementId);
  }

  //wyszukiwanie elementów DOM po id
  bindToElement(elementToFindById) {
    //przypisanie znalezionego obiektu do stałej element
    const element = document.getElementById(elementToFindById);

    if (!element) {
      throw new Error(
        `Nie znaleziono elementu elementu o id: ${elementToFindById}`
      );
    }
    return element;
  }
  //przełączanie miedzy oknami za pomocą stałych
  changeVisibilityScreen(element, mode) {
    mode === VISIBLE_SCREEN
      ? element.classList.remove(HIDDEN_CLASS)
      : element.classList.add(HIDDEN_CLASS);
  }
}
