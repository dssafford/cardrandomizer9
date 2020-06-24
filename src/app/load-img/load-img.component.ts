import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CardInfo} from '../model/CardInfo';
import {CARD_DATA} from '../data/cards';
import {RandomWord} from '../model/randomWord';
import {RANDOM_WORDS} from '../data/randomWords';
import * as find from 'lodash/find';
import * as shuffle from 'lodash/shuffle';
import {log} from 'util';
import {Observable, timer} from 'rxjs';
import {Answer} from '../model/answer';
import {CardService} from '../service/card.service';
import {WrongAnswer} from '../model/wrongAnswer';

@Component({
    selector: 'app-load-img',
    templateUrl: './load-img.component.html',
    styleUrls: ['./load-img.component.scss']
})
export class LoadImgComponent implements OnInit {

    imgsrc = ''; // 'assets/images/2_of_hearts.png';
    bkgsrc = 'assets/images/bg.jpg';

    results: CardInfo[] = CARD_DATA;
    // card: CardInfo[] = [];
    // card: CardInfo;
    // // deck: any = [];
    // suits: string[] = ['hearts', 'diamonds', 'spades', 'clubs'];
    // ranks: string[]  = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
    // deck: number[]  = [52]; // how many total
    // myIndex: number;
    returndeck: CardInfo[] = new Array<CardInfo>();
    counter: number;
    person: string;
    action: string;
    object: string;
    firstCard = true;
    showPerson = false;
    showAction = false;
    showObject = false;
    showImage = false;
    showButton = 'Show Info';
    showPrevious = false;
    showNext = true;
    showReset = true;
    // myAnswers: string[] = [];
    enteredAnswer: string;
    myAnswer: Answer;
    myWrongAnswer: WrongAnswer;
    quizAnswers: Answer[] = [];
    // containerClass: string = 'dougexample-container';
    showAnswerInput = false;
    myWrongs: Answer[] = [];
    newWrongs: WrongAnswer[] = [];

    newWrongLength = 0;
    startTime: any;
    intervalStartTime = 0;
    // const startTime = n;
    const;
    tm = 0;
    d: any;
    n: any;
    currentTime: any;
    seconds = 0;
    secondsString = '0';
    centiseconds = 0;
    centisecondsString = '0';
    miliseconds = 0;
    milisecondsString = '0';
    hours = 0;
    hoursString = '';
    minutes = 0;
    minutesString = '';
    myTimer: string;
    testDoug = 'hobo';
    timerInterval: any;
    subscription1: any;
    subscription2: any;
    ticks = 0;
    timer = timer(2000, 1000);
    dude: number;
    timerStarted = false;
    testType: string;
    constructor(private http: HttpClient, private cardService: CardService) {
    }

  pao(inputString: string): void {
    // if (inputString === 'person') {
    //   this.showPerson = true;
    // } else if(inputString === 'action') {
    //   this.showAction = true;
    // } else {
    //   this.showObject = true;
    // }

  }
    onStartTimer() {
        this.d = new Date();
        this.n = this.d.getTime();
        this.intervalStartTime = this.n;

        if (!this.timerStarted) {
            this.timerStarted = true;
            this.subscription1 = this.timer.subscribe(t => this.ticks = t);
            this.subscription2 = this.timer.subscribe(x => {
                this.updateTimer(this.intervalStartTime);
            });
            // this.startTime = new Date(); // Generate a timestamp when you need to start countdown
        }
    }
    onResetTimer() {
        this.myTimer = '00:00';
        // this.subscription1.unsubscribe();
        // this.subscription2.unsubscribe();

        // console.log(new Date().getTime() - this.startTime.getTime()); // When you need, subtract saved date from new one
    }
    onStopTimer() {
        this.timerStarted = false;
        this.subscription1.unsubscribe();
        this.subscription2.unsubscribe();

        // console.log(new Date().getTime() - this.startTime.getTime()); // When you need, subtract saved date from new one
    }


    updateTimer(dougStartTime: number) {
        this.intervalStartTime = dougStartTime;

        this.d = new Date();
        this.n = this.d.getTime();
        this.currentTime = this.n;

        this.tm = (this.currentTime - this.intervalStartTime);
        this.hours = Math.floor(this.tm / 1000 / 60 / 60);
        this.minutes = Math.floor(this.tm / 60000) % 60;
        this.seconds = ((this.tm / 1000) % 60);

        // console.log('seconds=' + this.seconds);


        if (!Number.isNaN(this.seconds)) {
            this.secondsString = this.seconds.toString().match(/^-?\d+(?:\.\d{0,-1})?/)[0];
        }
        // this.milisecondsString = ('00' + this.tm).slice(-3);
        // this.centiseconds = this.miliseconds / 10;

        // if ( !Number.isNaN(this.centiseconds) && this.centiseconds !== null) {
        //     this.centisecondsString = (this.centiseconds).toString().match(/^-?\d+(?:\.\d{0,-1})?/)[0];
        // }
        if (this.minutes !== null) {
            this.minutesString = (this.minutes < 10 ? '0' : '') + this.minutes;
        }
        if (this.seconds !== null) {
            this.secondsString = (this.seconds < 10 ? '0' : '') + this.seconds.toFixed(2);
        }

        // this.centisecondsString = (this.centiseconds < 10 ? '0' : '') + this.centiseconds;

        this.hoursString = this.hours + (this.hours > 0 ? ':' : '0');

        if (this.hours === 0) {
            this.hoursString = '0';
        }
        this.myTimer = this.hoursString + ' - ' + this.minutesString + ':' + this.secondsString;
   }


    onSubmit() {
         // debugger

        if (this.counter < 52) {
            this.myAnswer = new Answer();
            this.myAnswer.id = this.counter;
            if (this.testType === 'person') {
              this.myAnswer.question = this.person;
            } else if(this.testType === 'action') {
              this.myAnswer.question = this.action;
            } else {
              this.myAnswer.question = this.object;
            }
            this.myAnswer.answer = this.enteredAnswer;
            this.myWrongAnswer = new WrongAnswer();
            this.myWrongAnswer.answer = this.person;


            if (this.myAnswer.question.includes(this.myAnswer.answer)) {
                this.myAnswer.correct = true;
            } else {
                this.myAnswer.correct = false;
                this.newWrongLength = this.newWrongLength + 1;
                this.myWrongs.push(this.myAnswer);

                this.newWrongs.push(this.myWrongAnswer);
            }
            this.quizAnswers.push(this.myAnswer);
            this.enteredAnswer = '';
            this.goNext();
        } else {
            // this.containerClass = 'color-container';
            this.goNext();
        }
    }

    reset() {
        this.counter = 0;
        this.firstCard = true;
        this.showImage = false;
        this.returndeck = this.shuffleCards(this.results);
        console.log('RESET - Shuffled Deck:');
        console.log(this.returndeck);
        this.showPrevious = false;
        this.showNext = true;
        this.showButton = 'Show Info';
        this.showPerson = false;
        this.showObject = false;
        this.showAction = false;
        this.myWrongs = [];
        this.newWrongLength = 0;
    }

    doshow() {
        if (this.showButton === 'Show Info') {
            this.showButton = 'Hide Info';
        } else {
            this.showButton = 'Show Info';
        }
        if (this.showPerson) {
            this.showPerson = false;
        } else {
            this.showPerson = true;
        }

        if (this.showAction) {
            this.showAction = false;
        } else {
            this.showAction = true;
        }

        if (this.showObject) {
            this.showObject = false;
        } else {
            this.showObject = true;
        }
    }

    showCard() {
        this.imgsrc = 'assets/images/' + this.returndeck[this.counter].card_name + '.png';
        this.person = this.returndeck[this.counter].person_name;
        this.action = this.returndeck[this.counter].action_name;
        this.object = this.returndeck[this.counter].object_name;
    }

    goPrevious() {
        this.showImage = true;
        this.counter = this.counter - 1;

        if (this.counter < 52) {
            this.imgsrc = 'assets/images/' + this.returndeck[this.counter].card_name + '.png';
            this.person = this.returndeck[this.counter].person_name;
            this.action = this.returndeck[this.counter].action_name;
            this.object = this.returndeck[this.counter].object_name;
        } else {
            this.imgsrc = '';
            this.bkgsrc = 'assets/images/bg.jpg';
            console.log('all done');
        }

        if (this.counter > 0) {
            this.showPrevious = true;
        } else {
            this.showPrevious = false;
        }

        if (this.counter < 52) {
          if (this.firstCard === true) {
            this.showNext = false;
          } else {
            this.showNext = true;
          }
        } else {
            this.showNext = false;
        }
        // if (this.counter > 0 ) {
        //     this.counter = this.counter - 1 ;
        // } else {
        //     this.counter = 0;
        // }

    }

    goNext() {
      if (this.firstCard === true) {
        this.counter = 0;
        this.showImage = true;
        this.showCard();
        this.firstCard = false;
      } else { // not first card
        this.counter = this.counter + 1;
        // console.log('in else counter = ' + this.counter);
        if (this.counter >= 52) {
          this.showNext = false;
          this.showPrevious = false;
        } else {
          this.showImage = true;
          this.showCard();
        }
      }

      if (this.counter > 0) {
        this.showPrevious = true;
      } else {
        this.showPrevious = false;
      }

      if (this.counter < 51) {
        this.showNext = true;

      } else if (this.counter >= 52) {
        this.showNext = false;
        this.showPrevious = false;

      } else {
            this.showNext = false;
        }


    }

    onSaveWrongs() {

        this.cardService.saveScore(this.newWrongs).subscribe(
            data => {
                // refresh the list
                // console.log(data)
                return true;
            },
            error => {
                console.error('Error in client onInit!');
                throw error;
            }
        );

    }
    ngOnInit() {
      this.testType = 'person';
      this.d = new Date();
      this.n = this.d.getTime();
      this.intervalStartTime = this.n;
      this.tm = 0;
      this.counter = 0;
      this.returndeck = this.shuffleCards(this.results);

    }

    shuffleCards(originalArray: Array<CardInfo>) {
        let finalRandomArray = new Array<CardInfo>();
        finalRandomArray = shuffle(originalArray);
        return finalRandomArray;
    }
}
