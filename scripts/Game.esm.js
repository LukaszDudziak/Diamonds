import { Common, VISIBLE_SCREEN } from "./Common.esm.js";
import { DATALOADED_EVENT_NAME } from "./Loader.esm.js";
import { EMPTY_BLOCK, gameLevels, GAME_BOARD_X_OFFSET, GAME_BOARD_Y_OFFSET } from "./gameLevels.esm.js";
import { canvas } from "./Canvas.esm.js";
import { media } from "./Media.esm.js";
import { GameState } from "./GameState.esm.js";
import { mouseController } from "./MouseController.esm.js";
import { DIAMOND_SIZE, NUMBER_OF_DIAMONDS_TYPES } from "./Diamond.esm.js";
import { resultScreen } from './ResultScreen.esm.js';
import { userData } from "./UserData.esm.js";


//rozmiary tablicy
const DIAMONDS_ARRAY_WIDTH = 8;
const DIAMONDS_ARRAY_HEIGHT = DIAMONDS_ARRAY_WIDTH + 1; //z ukrytą pierwszą linią 
const LAST_ELEMENT_DIAMONDS_ARRAY = DIAMONDS_ARRAY_WIDTH * DIAMONDS_ARRAY_HEIGHT - 1;
const SWAPPING_SPEED = 8;
const TRANSPARENCY_SPEED = 10;

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
    //odnajdywanie połączeń między płytkami
    this.findMatches();
    //zamiana płytek
    this.moveDiamonds();
//ukrywanie diamentów
    this.hideAnimation();
    //liczenie punktów
    this.countScores();
    //reset flag isMoving i isSwapping
    this.revertSwap();
//czyszczenie dopasowanych płytek
    this.clearMatched();
    //rysuje background
    canvas.drawGameOnCanvas(this.gameState);
    //pobiera caly przygotowany game board zawierajacy juz obiekty Diamond i rysuje zgodnie z wytycznymi metody 
    this.gameState.getGameBoard().forEach(diamond => diamond.draw());
    //fix na sytuację w której mimo wolnych ruchów, nie ma żadnego który umożliwi zdobycie punktów
    this.checkPosibilityMovement();
    //sprawdzenie czy gra się zakończyła 
    this.checkEndOfGame();
    
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

  findMatches(){
    //iteruje po całej tablicy, z której mam dostęp do pojedynczego diamonda, o danym indexie z całej tablicy
    this.gameState.getGameBoard().forEach((diamond, index, diamonds) =>{
      //pominięcie pierwszych 8 elementów, które są empty i ukryte (poprzez sprawdzenie czy właśnie nie czytam empty i czy index nie osiągnął ostatniego bloku (bo wtedy nie dopasuje skrajnych wartości))
      if(diamond.kind === EMPTY_BLOCK || index === LAST_ELEMENT_DIAMONDS_ARRAY){
        return;
      }
      //sprawdzenie czy rodzaj konkretnego diamonda pokrywa się z typem tych diamentów o indeksie +/- 1
      if(
        diamonds[index - 1].kind === diamond.kind
        && diamonds[index + 1].kind === diamond.kind
      ){
        //sprawdzenie czy one są w ogóle w jednej linii (wierszu)
        if(Math.floor((index - 1)/ DIAMONDS_ARRAY_WIDTH) === Math.floor((index + 1)/ DIAMONDS_ARRAY_WIDTH)){
          //dodawanie wartości match na podstawie ilości połączeń
          for(let i = -1; i <= 1; i++){
            diamonds[index + i].match++;
          }
        }
      }
      //sprawdzenie dla pionowych wartości, czy index nie jest większy od DAW (te które mają index 0-7 są w linii ukrytych), czy nie jest ostatnim elementem, czy +/- ma ten sam kind co konkretny diament
      if(
         index >= DIAMONDS_ARRAY_WIDTH
         && index < LAST_ELEMENT_DIAMONDS_ARRAY - DIAMONDS_ARRAY_WIDTH + 1
         && diamonds[index - DIAMONDS_ARRAY_WIDTH].kind === diamond.kind
         && diamonds[index + DIAMONDS_ARRAY_WIDTH].kind === diamond.kind
        ){
          //sprawdzenie, czy eleemnty są w jednej osi y (ze sprytnym wykorzystaniem modulo)
          if ((index - DIAMONDS_ARRAY_WIDTH) % DIAMONDS_ARRAY_WIDTH === (index + DIAMONDS_ARRAY_WIDTH) % DIAMONDS_ARRAY_WIDTH){
            //pamiętać, że lecę "do góry"
            for(let i = -DIAMONDS_ARRAY_WIDTH; i <= DIAMONDS_ARRAY_WIDTH; i += DIAMONDS_ARRAY_WIDTH){
              diamonds[index + i].match++;
            }
          }
        }
    });
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

  hideAnimation(){
    if(this.gameState.getIsMoving()){
      return;
    }
    this.gameState.getGameBoard().forEach(diamond =>{
      //zmiana transparentności na ukrywanym 
      if(diamond.match && diamond.alpha > 10){
        diamond.alpha -= TRANSPARENCY_SPEED;
        this.gameState.setIsMoving(true);
      }
    })
  }

  countScores(){
    this.scores = 0;
    //pobranie boarda i dodanie matchów z każdego diamonda
    this.gameState.getGameBoard().forEach(diamond => this.scores += diamond.match);

    if(!this.gameState.getIsMoving() && this.scores){
      this.gameState.increasePlayerPoints(this.scores);
    }
  }

  revertSwap(){
    if(this.gameState.getIsSwapping() && !this.gameState.getIsMoving()){
      if(!this.scores){
        this.swapDiamonds();
        this.gameState.increasePlayerPoints()
      }
      this.gameState.setIsSwapping(false);
    }
  }

  clearMatched(){
    //nie sprawdzaj dopasowań w momencie, gdy jakieś płytki się przemieszczają
    if(this.gameState.getIsMoving()){
      return;
    }
    //iteruje po tablicy od końca, po to, żeby diamenty ładnie spadały od góry na dół
    this.gameState.getGameBoard().forEach((_, idx, diamonds) =>{
      const index = diamonds.length - 1 - idx;
      //przypisuje c i r żeby wiedzieć gdzie w ogóle jestem
      const column = Math.floor(index / DIAMONDS_ARRAY_WIDTH);
      const row = Math.floor(index % DIAMONDS_ARRAY_WIDTH);
      //sprawdzam, czy któryś z diamentów z iterowanej tablicy ma dopasowania 
      if (diamonds[index].match){
        //obczajam po kolumnie jak będzie spadanko
        for(let counter = column; counter >= 0; counter--){
          //sprawdzenie, czy diament w konkretnym miejscu (nad ostatnim dopasowanym) nie ma dopasowania 
          if(!diamonds[counter * DIAMONDS_ARRAY_WIDTH + row].match){
            //jeśli znajduje sobie, to wymieniam niedopasowany na miejsce dopasowanego
            this.swap(diamonds[counter * DIAMONDS_ARRAY_WIDTH + row], diamonds[index]);
            break;
          }
        }
      }
    });
    
    //teraz lece sobie w poziomie
    this.gameState.getGameBoard().forEach((diamond, index) =>{
      //pobieram row danego obiektu 
      const row = Math.floor(index % DIAMONDS_ARRAY_WIDTH) * DIAMOND_SIZE;
      //sprawdzenie czy to nie jest aby pierwsza linia, która ma zostać niewidoczna i która się nie wlicza, więc od razu przypisuje mu empty blocka i zeruje matche, żeby nie dostawać punktów z nikąd
      if(index < DIAMONDS_ARRAY_WIDTH){
        diamond.kind = EMPTY_BLOCK;
        diamond.match = 0;
        //jeśli natomiast któryś jest dopasowany lub jest transparentny
      } else if( diamond.match || diamond.kind === EMPTY_BLOCK){
        //to losuje mu jakiś nowy rodzaj 
        diamond.kind = Math.floor(Math.random() * NUMBER_OF_DIAMONDS_TYPES);
        diamond.y = 0;
        diamond.x = row;
        diamond.match = 0;
        diamond.alpha = 255;
      }
    })
  }
//
  checkPosibilityMovement(){
    if(this.gameState.getIsMoving()){
      return true;
    }

    this.isPossibleToMove = this.gameState.getGameBoard().some((diamond, index, diamonds) =>{
      if(diamond.kind === EMPTY_BLOCK){
        return false;
      }

      //ruch w prawo => sprawdzenie w rzędzie, czyli czy jeśli przesunę konkretny diament w prawą, do czy kolejne diamenty w rzędzie od nowej pozycji utworzą mi matcha [x 0 x x] => [0 x x x] (-3 bo muszę sprawdzić w momencie gdy do skraju mam max 3 pozycje)
      if(
        index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 3
        && diamond.kind === diamonds[index + 2].kind
        && diamond.kind === diamonds[index + 3].kind 
      ){
        //jeśli tak, to jest możliwość ruchu
        return true;
      }

      //ruch w prawo => sprawdzenie w środku kolumny, czyli, czy jeśli przesunę konkretny diament w prawą, to czy kolejne diamenty w kolumnie od nowej pozycji utworzą matcha [ 0 x 0]    [ 0 x 0]  (-1 bo skrajny będzie sprawdzany w kolumnie, więc pozycja w rzędzie zmieni się jedynie o 1 )
      //                     [ x 0 0] >> [ 0 x 0]
      //                     [ 0 x 0]    [ 0 x 0]
      if(
          index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 1
          && Math.floor( index / DIAMONDS_ARRAY_WIDTH) > 1
          && Math.floor( index / DIAMONDS_ARRAY_WIDTH) < DIAMONDS_ARRAY_HEIGHT - 1
          && diamond.kind === diamond[index - DIAMONDS_ARRAY_WIDTH + 1].kind
          && diamond.kind === diamond[index + DIAMONDS_ARRAY_WIDTH + 1].kind //do zgłoszenia na udemy!!! !!! !!!
      ){
        return true;
      }

      //ruch w prawo => czy jest na szczycie kolumny [ x 0 0]   [ 0 x 0]
      //                                             [ 0 x 0] > [ 0 x 0]
      //                                             [ 0 x 0]   [ 0 x 0]
      if(
        index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 1
        && Math.floor(index / DIAMONDS_ARRAY_WIDTH) < DIAMONDS_ARRAY_HEIGHT - 2
        && diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH + 1].kind
        && diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH * 2 + 1].kind
      ){
        return true;
      }

      ///ruch w prawo => czy jest na dole kolumny    [ 0 x 0]   [ 0 x 0]
      //                                             [ 0 x 0] > [ 0 x 0]
      //                                             [ x 0 0]   [ 0 x 0]
      if(
        index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 1
        && Math.floor(index / DIAMONDS_ARRAY_WIDTH) > 2
        && diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH + 1].kind
        && diamond.kind === diamonds[index - DIAMONDS_ARRAY_WIDTH * 2 + 1].kind
      ){
        return true;
      }

      //ruch w lewa => w rzedzie
      if(
        index % DIAMONDS_ARRAY_WIDTH > 2
        && diamond.kind === diamonds[index - 2].kind
        && diamond.kind === diamonds[index - 3].kind 
      ){
        //jeśli tak, to jest możliwość ruchu
        return true;
      }
      //ruch w lewa => w srodku kolumny
      if(
        index % DIAMONDS_ARRAY_WIDTH
        && Math.floor( index / DIAMONDS_ARRAY_WIDTH) > 1
        && Math.floor( index / DIAMONDS_ARRAY_WIDTH) < DIAMONDS_ARRAY_HEIGHT - 1
        && diamond.kind === diamond[index - DIAMONDS_ARRAY_WIDTH - 1].kind
        && diamond.kind === diamond[index + DIAMONDS_ARRAY_WIDTH - 1].kind 
    ){
      return true;
    }

    //ruch w lewo => czy jest na szczycie kolumny                                            
      if(
        index % DIAMONDS_ARRAY_WIDTH < DIAMONDS_ARRAY_WIDTH - 1
        && Math.floor(index / DIAMONDS_ARRAY_WIDTH) < DIAMONDS_ARRAY_HEIGHT - 2
        && diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH + 1].kind
        && diamond.kind === diamonds[index + DIAMONDS_ARRAY_WIDTH * 2 + 1].kind
      ){
        return true;
      }


      return false;
    })
  }


  checkEndOfGame(){
    if(!this.gameState.getLeftMovement() && !this.gameState.getIsMoving() && !this.gameState.getIsSwapping()){
      const isPlayerWinner = this.gameState.isPlayerWinner();
      // numer jest przekazywany ze stringa więc żeby nie było konkatenacji, to pykamy parsowanie do  number
      const currentLevel = Number(this.gameState.level);

      if(isPlayerWinner && gameLevels[currentLevel]){
        //odblokowanie kolejnego levelu, jeśli nie jest już dostępny, 
        if(!userData.checkAvailabilityLevel(currentLevel + 1)){
          userData.addNewLevel(currentLevel + 1);
        }
      }
      //przypisanie nowej wartości HighScores jeśli wynik jest większy niż to co zapisane w local storage
      if(userData.getHighScores(currentLevel) < this.gameState.getPlayerPoints()){
        userData.setHighScore(currentLevel, this.gameState.getPlayerPoints());
      }
      
      resultScreen.viewResultScreen(isPlayerWinner,this.gameState.getPlayerPoints(), currentLevel);
    } else{
      //jeśli gra się nie zakończyła to rysuj se dalej
      this.animationFrame = window.requestAnimationFrame(() => this.animate());
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
