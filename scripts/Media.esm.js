//nie wykorzystuje żadnego commona, bo nie używa nic z htmla
class Media {
  constructor() {
    //property prywatne zarządzane przez klasę
    this._backgroundImage = null;
    this._diamondsSprite = null;
    //obsluga dzwiekow
    this.musicVolume = 0.3;
    this.soundVolume = 0.5;
    this.allowedMusic = true;
    this.allowedSound = true;
    this._swapSound = null;
    this._backgroundMusic = null;
    this.isInLevel = false;
  }

  increaseMusicVolume(){
    this.musicVolume += 0.1;
    if(this.musicVolume > 1){
      this.musicVolume = 1;
    }
    if(this._backgroundMusic){
    this._backgroundMusic.volume = this.musicVolume;
    }
  }
  decreaseMusicVolume(){
    this.musicVolume -= 0.1;
    if(this.musicVolume < 0){
      this.musicVolume = 0;
    }
    if(this._backgroundMusic){
      this._backgroundMusic.volume = this.musicVolume;
      }
  }

  increaseSoundVolume(){
    this.soundVolume += 0.1;
    if(this.soundVolume > 1){
      this.soundVolume = 1;
    }
    if (this._swapSound) {
    this._swapSound.volume = this.soundVolume;
    }
  }
  decreaseSoundVolume(){
    this.soundVolume -= 0.1;
    if(this.soundVolume < 0){
      this.soundVolume = 0;
    }
    if (this._swapSound) {
    this._swapSound.volume = this.soundVolume;
    }
  }

  playBackgroundMusic(){
    if(!this.allowedMusic || !this._backgroundMusic){
      return;
    }
    
    this._backgroundMusic.loop = true;
    this._backgroundMusic.play();
  }

  stopBackgroundMusic(){
    if(this._backgroundMusic){
      this._backgroundMusic.pause();
      }
  }

  playSwapSound(){
    if(!this.allowedSound){
      return;
    }

    this._swapSound.play();
  }

  set swapSound(sound){
    this._swapSound = sound;
    this._swapSound.volume = this.soundVolume;
  }

  set backgroundMusic(music){
    this._backgroundMusic = music;
    this._backgroundMusic.volume = this.musicVolume;
  }
  //sprawdza czy zaøadowany jest dzwiek, zwraca flage
  get swapSound(){
    return Boolean(this._swapSound);
  }

  get backgroundMusic(){
    return !!this._backgroundMusic;
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

  toggleMusicOnOff(){
    if(this.allowedMusic){
      this.allowedMusic = false;
      this.stopBackgroundMusic();
    } else{
      this.allowedMusic = true;
      this.playBackgroundMusic();
    }
  }

  toggleSoundOnOff(){
    if(this.allowedSound){
      this.allowedSound = false;
    } else{
      this.allowedSound = true;
    }
  }
}



export const media = new Media();
//użycie setera, co ostatecznie 'ukrywa' prywatną propertę
// media.backgroundImage = new Image();
