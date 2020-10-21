import {Diamond} from './Diamond.esm.js'

//klasa obecnego stanu gry
export class GameState{
    constructor(level,leftMovement, pointsToWin, diamonds, diamondsSpriteImage){
        let _leftMovement = leftMovement;
        let _playerScores = 0;
        //diamond, wyzej zwany boardem przekazywany jest w momencie startu nowego lvl i jest to nic innego jak tablica calej planszy wyciagnieta z gameLevels a w tym momencie zmapowana w ten sposob, ze z kazdej pozycji w tablicy tworzony jest obiekt Diamonds ("luzne property sa wpisywane w obiekt i zapisywane ponownie w tablicy")
        let _gameBoard = diamonds.map(({x,y,row,column,kind}) => new Diamond(x,y,row,column,kind, diamondsSpriteImage));
        //flagi dla przemieszczających się płytek
        let _isSwapping = false;
        let _isMoving = false;
        this._pointsToWin = pointsToWin;
        this._level = level;

        //użycie clousures na zmiennej z metodą z Canvas
        this.getLeftMovement = () => _leftMovement;

        this.decreasePointsMovement = () => _leftMovement--;
        this.increasePointsMovement = () => _leftMovement++;

        this.getPlayerPoints = () => _playerScores;
        this.increasePlayerPoints = points => _playerScores += points;

        this.getIsSwapping = () => _isSwapping;
        this.setIsSwapping = value => _isSwapping = value;
        this.getIsMoving = () => _isMoving;
        this.setIsMoving = value => _isMoving = value;

        this.isPlayerWinner = () =>_playerScores >= this._pointsToWin;

        this.getGameBoard = () =>_gameBoard;
    }

    get level(){
        return this._level;
    }
    get pointsToWin(){
        return this._pointsToWin;
    }
}