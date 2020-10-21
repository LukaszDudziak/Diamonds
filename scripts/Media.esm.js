//nie wykorzystuje żadnego commona, bo nie używa nic z htmla
class Media {
  constructor() {
    //property prywatne zarządzane przez klasę
    this._backgroundImage = null;
    this._diamondsSprite = null;
  }
  //setter który jest sposobem klasy na zarządzanie prywatną propertą
  set backgroundImage(imageObject) {
    //zabezpieczenie property przed złymi danymi
    if (!imageObject instanceof Image) {
      return;
    }
    this._backgroundImage = imageObject;
  }
  //getter jako sposób pobierania danych z klasy
  get backgroundImage() {
    return this._backgroundImage;
  }

  //getter i setter dla sprajta diamentów
  set diamondsSprite(imageObject) {
    if (!imageObject instanceof Image) {
      return;
    }
    this._diamondsSprite = imageObject;
  }
  get diamondsSprite() {
    return this._diamondsSprite;
  }
}

export const media = new Media();
//użycie setera, co ostatecznie 'ukrywa' prywatną propertę
// media.backgroundImage = new Image();
