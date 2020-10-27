//klasa do zapisywania danych użytkownika 
class UserData{
    constructor(){
        if(!localStorage.length){
            //w momencie gdy nie ma nic w lStorage, to nadaję planszę pierwszą z zerowym b.score
            localStorage.setItem('1', JSON.stringify({active:true, bestScore:0}));
        }
    }
    //sprawdzanie czy dany level jest w ogóle dostęp[ny]
    checkAvailabilityLevel(levelNumber) {
        const item = localStorage.getItem(String(levelNumber));
        //jeśli local nie ma itemu o takim numerze, to mówi nie
        if(!item){
            return false;
        }
        //a jak ma to wyciągamy z itemu "active"
        const {active} = JSON.parse(item)

        return active;
    }
    //dodawanie nowego levelu po wygranej
    addNewLevel(levelNumber){
        localStorage.setItem(String(levelNumber), JSON.stringify({active: true, bestScore: 0}));
    }
    //pobieranie bScore z konkretnego levelu
    getHighScores(levelNumber){
        const item = localStorage.getItem(String(levelNumber));
        const {bestScore} = JSON.parse(item);

        return bestScore;
    }
//ustawienie nowego hScore
    setHighScore(levelNumber, newHighScore){
        localStorage.setItem(String(levelNumber), JSON.stringify({active:true, bestScore: newHighScore}));
    }
}

export const userData = new UserData();