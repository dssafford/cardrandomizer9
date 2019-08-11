import {Injectable} from '@angular/core';

import {CardInfo} from '../model/CardInfo';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Answer} from '../model/answer';
import {WrongAnswer} from '../model/wrongAnswer';


@Injectable({
    providedIn: 'root'
})
export class CardService {

    constructor(private http: HttpClient) {
    }

    saveScore(wrongList: WrongAnswer[]) {
        // debugger
        console.log('wrongList below');
        console.log(JSON.stringify(wrongList));
        //
        // const myString = '{"myWrongs" : [{"id":1,"answer":"dsf","question":"pam"},{"id":2,"answer":"sdaf","question":"steve"}]';

        // const myString = ["10_of_clubs", "10_of_diamonds", "3_of_diamonds"];
        const myString = JSON.stringify(wrongList);

        // console.log(wrongList.toString());



        return this.http.post('http://localhost:3000/api/enterTest',
            myString,
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'application/json')
            }
        )
            .pipe(
                catchError(this.handleError) // then handle the error
            );
    }

    addArray(masterList: CardInfo[], wrongList: WrongAnswer[]) {
        const headers = new HttpHeaders({'Content-type': 'application/json'});
        // return this.http.post('http://localhost:3000/api/enteranswers', 'test', { headers: headers})
        //     .pipe(response: Response) => {
        //     console.log (response.json());

        const myvar =  { 'name' : [
                '10_of_clubs',
                '10_of_diamonds',
                '6_of_spades',
                'king_of_diamonds',
                '4_of_spades',
                '10_of_hearts',
                'jack_of_diamonds',
                '7_of_clubs',
                '6_of_hearts',
                '2_of_spades',
                '3_of_spades',
                '4_of_spades',
                '5_of_spades',
                '6_of_spades',
                '7_of_spades',
                '8_of_spades',
                '9_of_spades',
                '10_of_spades',
                '2_of_diamonds',
                '3_of_diamonds',
                '10_of_clubs',
                '10_of_diamonds',
                '6_of_spades',
                'king_of_diamonds',
                '4_of_spades',
                '10_of_hearts',
                'jack_of_diamonds',
                '7_of_clubs',
                '6_of_hearts',
                '2_of_spades',
                '3_of_spades',
                '4_of_spades',
                '5_of_spades',
                '6_of_spades',
                '7_of_spades',
                '8_of_spades',
                '9_of_spades',
                '10_of_spades',
                '2_of_diamonds',
                '3_of_diamonds'
            ]};


            return this.http.post('http://localhost:3000/api/enteranswers',
                masterList,
                {
                    headers: new HttpHeaders()
                        .set('Content-Type', 'application/json')
                }
            )
                .pipe(
                    catchError(this.handleError) // then handle the error
                );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may conta
            //
            // in clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    }

    GetCardInfoFromCardName(cardName: string, masterCardList: Array<CardInfo>) {

        var i = 0;

        // for( i = 0; i < masterCardList.length; i++) {
        // if(cardName.equals(masterCardList(i).getCardName())){
        // return masterCardList.get(i);
        return i;
    }

    // return null;
    // }



    //     this.newAnswers = new Array < Answer >();
    //     for( let i = 0; i < this.questions.length; i++) {
    //       finalNumber = finalNumber + this.questions[i];
    //      }




    // public ArrayList<CardInfo> createCardLearningMasterList() {
    //
    //     // ArrayList<CardInfo> learningmasterCards = cardRepository.findAll();
    //     // load all of the cards from a file
    //
    //
    //
    //     return learningmasterCards;
    //
    // }

//     CreateRandomLearningDeck(): Array<CardInfo> {
//
//     workinglearningRandomCards: Array<CardInfo>  = new Array<CardInfo>();
//
//     //Create master CardInfo Arraylist
//     learningRandomCards = cardService.createCardLearningMasterList();
//
//     //Get random deck
//     cachedShuffledCardNames = cardService.listAllCards();
//     session.setAttribute("cachedShuffledCardNames", cachedShuffledCardNames);
//
//     //loop through random deck and get CardInfo information
//     for (let i = 0; i < cachedShuffledCardNames.length(); i++) {
//     workinglearningRandomCards.add(GetRandomCardInfo(cachedShuffledCardNames.get(i).getCardName()));
// }
//
//
// return workinglearningRandomCards;
//
// }




    //
    // getRandomWordResult(inputNumber: number) {
    //     const q = find(RANDOM_WORDS, {id: Number(inputNumber)});
    //     if (q !== undefined) {
    //         console.log(q); // {name:'Dave',sex:male,age:34}
    //         return q.word;
    //     } else {
    //         return 'ERROR IN GetRandomWordsList';
    //     }
    // }








}
