import { Common, VISIBLE_SCREEN } from "./Common.esm.js";
import { DATALOADED_EVENT_NAME } from "./Loader.esm.js";
import { gameLevels, GAME_BOARD_X_OFFSET, GAME_BOARD_Y_OFFSET } from "./gameLevels.esm.js";
import { canvas } from "./Canvas.esm.js";
import { media } from "./Media.esm.js";
import { GameState } from "./GameState.esm.js";
import { mouseController } from "./MouseController.esm.js";
import { DIAMOND_SIZE } from "./Diamond.esm.js";


//rozmiary tablicy
const DIAMONDS_ARRAY_WIDTH = 8;
const DIAMONDS_ARRAY_HEIGHT = DIAMONDS_ARRAY_WIDTH + 1; //z ukrytą pierwszą linią 
const SWAPPING_SPEED = 8;

class Game extends Common {
  constructor() {
    super();
  }
  //uruchomienie rozgrywania pojedynczego lvl
  playLevel(level) {
   //wyciagniecie info z tablicy leveli przez destrukturyzacje obiektu gameLevels, podawany jest min. board, gdzie sa dane wszystkich konkretnych komorek planszy
  const {numberOfMovements, pointsToWin, board } = gameLevels[level - 1];    

    window.removeEventListener(DATALOADED_EVENT_NAME, this.playLevel);
    //przy dodadowaniu nowej planszy tworzony bédzie nowa instancja klasy stanu gry, jesli chodzi o level, nie odnosze sie bezposrednio do gamelevels, bo to da mi referencje do obiektu, przez co po ponownym odtworzeniu danego lvl bede mial przemieszane diamenty a nie takie jakie powinny byc w stanie wyjsciowym, w tym miejscu leci tez caly board, w ktorym zapisane sa wszystkie komorki
    this.gameState = new GameState(level, numberOfMovements, pointsToWin, board, media.diamondsSprite);
    //ustawienie widoczności elementu canvas
    this.changeVisibilityScreen(canvas.element, VISIBLE_SCREEN);
//tworzenie obiektu diamentu
    this.animate();
  }

  //metoda animacji
  animate() {
    //sprawdzanie stanu myszy
    this.handleMouseState();
    //ogarnięcie klika
    this.handleMouseClick();
    //zamiana płytek
    this.moveDiamonds();
    //reset flag isMoving i isSwapping
    this.revertSwap();
    //rysuje background
    canvas.drawGameOnCanvas(this.gameState);
    //pobiera caly przygotowany game board zawierajacy juz obiekty Diamond i rysuje zgodnie z wytycznymi metody 
    this.gameState.getGameBoard().forEach(diamond => diamond.draw());

    this.animationFrame = window.requestAnimationFrame(() => this.animate());
  }
  handleMouseState(){
    //nadaje kolejny state wybranej płytce, pod warunkiem że nie jest w tym momencie "wymieniana" ani "poruszająca się"
    if (mouseController.clicked && !this.gameState.getIsSwapping() && !this.gameState.getIsMoving()){
      mouseController.state++;
    }
  }

  handleMouseClick(){
    //jeśli nie był kliknięty, metoda ma być olana
    if(!mouseController.clicked){
      return;
    }
    //obliczenie "gdzie kliknąłem", potrzebny do tego koordynat, oraz przesunięcie, jako że plansza nie jest od samej krawędzi, następnie wielkość dzielona przez wielkość pojedynczej płytki, dzięki czemu można określić, która została kliknięta
    const xClicked = Math.floor((mouseController.x - GAME_BOARD_X_OFFSET) / DIAMOND_SIZE);
    const yClicked = Math.floor((mouseController.y - GAME_BOARD_Y_OFFSET) / DIAMOND_SIZE);

    //sprawdzenie czy klik jest poza planszą, jeśli tak, to reset state
    if(!yClicked || xClicked >= DIAMONDS_ARRAY_WIDTH || yClicked >= DIAMONDS_ARRAY_HEIGHT ){
      mouseController.state = 0;
      return;
    }
    //jeśli git i state zostaje na "klikniętym" to zależnie od tego, który to klik mamy dwie opcje, czyli rozróżnienie, czy to był pierwszy czy drugi wybrany kafel
    if(mouseController.state ===1){
      mouseController.firstClick = {
        x: xClicked,
        y: yClicked,
      }
    } else if(mouseController.state === 2){
      mouseController.secondClick = {
        x: xClicked,
        y: yClicked,
      }
      mouseController.state = 0;
      //no i sprawdzenie czy te dwa są obok siebie, jeśli nie to wyłączamy
      if(
        Math.abs(mouseController.firstClick.x - mouseController.secondClick.x) + 
        Math.abs(mouseController.firstClick.y - mouseController.secondClick.y) !== 1
      ){
        return;
      }
      //jeśli wszystko powyżej git, to zamieniamy
      this.swapDiamonds();
      //ustawienie na state, że jest obecnie swapowane oraz że musi być odjęty ruch gracza
      this.gameState.setIsSwapping(true);
      this.gameState.decreasePointsMovement(); 
      mouseController.state = 0;

    }

    mouseController.clicked = false;
  }
//wymiana płytek
  swapDiamonds(){
    //z racji tego, że nie mamy tablic dwuwymiarowych, to trzeba sobie radzić taką symulacją
    const firstDiamond = mouseController.firstClick.y * DIAMONDS_ARRAY_WIDTH + mouseController.firstClick.x;
    const secondDiamond = mouseController.secondClick.y * DIAMONDS_ARRAY_WIDTH + mouseController.secondClick.x;

    this.swap(this.gameState.getGameBoard()[firstDiamond], this.gameState.getGameBoard()[secondDiamond]);
  }

//poruszanie się płytek 
  moveDiamonds(){
    this.gameState.setIsMoving(false);
    this.gameState.getGameBoard().forEach(diamond => {
      let dx;
      let dy;

      for(let speedSwap = 0; speedSwap < SWAPPING_SPEED; speedSwap++){
        dx = diamond.x - diamond.row * DIAMOND_SIZE;
        dy = diamond.y - diamond.column * DIAMOND_SIZE;

        if(dx){
          diamond.x -= dx/Math.abs(dx);
        }

        if(dy){
          diamond.y -= dy/Math.abs(dy);
        }

        if (dx || dy){
          this.gameState.setIsMoving(true);
        }
      }
    });
  }

  revertSwap(){
    if(this.gameState.getIsSwapping() && !this.gameState.getIsMoving()){
      // if(!this.scores){
      //   this.swapDiamonds();
      //   this.gameState.increasePlayerPoints()
      // }
      this.gameState.setIsSwapping(false);
    }
  }

  //wymiana płytek
  swap(firstDiamond, secondDiamond){
    //wymiana wartości, do x przypisany będzie y, do y będzie przypisany x
    // [ x, y ] = [ y, x];
    [
      firstDiamond.kind,
      firstDiamond.alpha,
      firstDiamond.match,
      firstDiamond.x,
      firstDiamond.y,
      secondDiamond.kind,
      secondDiamond.alpha,
      secondDiamond.match,
      secondDiamond.x,
      secondDiamond.y
    ] = [
      secondDiamond.kind,
      secondDiamond.alpha,
      secondDiamond.match,
      secondDiamond.x,
      secondDiamond.y,
      firstDiamond.kind,
      firstDiamond.alpha,
      firstDiamond.match,
      firstDiamond.x,
      firstDiamond.y,
    ];
    //blokowanie ruchu w trakcie ruchu
    this.gameState.setIsMoving(true);

  }
}

export const game = new Game();
