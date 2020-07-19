import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CardInfo} from '../model/CardInfo';
import {CARD_DATA} from '../data/cards';
import * as shuffle from 'lodash/shuffle';
import {Observable, timer} from 'rxjs';
import {Answer} from '../model/answer';
import {CardService} from '../service/card.service';
import {WrongAnswer} from '../model/wrongAnswer';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-load-img',
  templateUrl: './load-img.component.html',
  styleUrls: ['./load-img.component.scss']
})
export class LoadImgComponent implements OnInit {
  constructor(private http: HttpClient, private cardService: CardService, public dialog: MatDialog) {
  }

  private confirmationDialogService: any;

  imgsrc = ''; // 'assets/images/2_of_hearts.png';
  imgsrc1 = '';
  imgsrc2 = '';
  imgsrc3 = '';

  bkgsrc = 'assets/images/bg.jpg';

  results: CardInfo[] = CARD_DATA;
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
  enteredAnswer: string;
  myAnswer: Answer;
  myWrongAnswer: WrongAnswer;
  quizAnswers: Answer[] = [];
  showAnswerInput = false;
  myWrongs: Answer[] = [];
  newWrongs: WrongAnswer[] = [];
  timerStartButtonName = 'Start';
  timerStarted = false;
  newWrongLength = 0;

  intervalStartTime = 0;
  const;
  tm = 0;
  d: any;
  n: any;
  currentTime: any;
  seconds = 0;
  secondsString = '0';
  hours = 0;
  hoursString = '';
  minutes = 0;
  minutesString = '';
  myTimer = '00:00:00';
  timerInterval: any;
  subscription1: any;
  subscription2: any;
  ticks = 0;
  timer = timer(2000, 1000);
  dude: number;
  isTimerStarted = false;
  testType: string;
  title = 'angular-confirmation-dialog';
  name = 'Angular 6';
  timeLeft = 1;
  newTime: string;
  newTimeNumber = 0;
  interval;
  message: string;
  myMinutes: any;
  mySeconds: any;

  pao(inputString: string): void {
    if (inputString === 'person') {
      this.showPerson = true;
    } else if (inputString === 'action') {
      this.showAction = true;
    } else {
      this.showObject = true;
    }

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

  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to ... ?')
      .then((confirmed) => console.log('User confirmed:', confirmed))
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
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
    if (this.minutes !== null) {
      this.minutesString = (this.minutes < 10 ? '0' : '') + this.minutes;
    }
    if (this.seconds !== null) {
      this.secondsString = (this.seconds < 10 ? '0' : '') + this.seconds.toFixed(2);
    }
    this.hoursString = this.hours + (this.hours > 0 ? ':' : '0');

    if (this.hours === 0) {
      this.hoursString = '0';
    }
    this.myTimer = this.hoursString + ':' + this.minutesString + ':' + this.secondsString;
    // console.log(this.myTimer);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '200px',
      data: 'Are you sure you want to reshuffle?',
      panelClass: 'dougpanel',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.reset();
        // DO SOMETHING
      } else {
        console.log('no clicked');
      }
    });
  }

  onSubmit() {
    // debugger

    if (this.counter < 51) {
      this.myAnswer = new Answer();
      this.myAnswer.id = this.counter;
      if (this.testType === 'person') {
        this.myAnswer.question = this.person;
      } else if (this.testType === 'action') {
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

    if (this.counter > 1) {
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

  goFirst() {
    this.counter = 0;
    this.showCard();
    this.firstCard = true;
    this.showNext = true;
    this.showPrevious = false;

  }

  goNext3() {
    if (this.firstCard === true) {
      this.counter = 0;
      this.showImage = true;
      this.showCard();
      this.firstCard = false;
    } else { // not first card
      this.counter = this.counter + 1;
      // console.log('in else counter = ' + this.counter);
      if (this.counter >= 53) {
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

  goNext() {
    if (this.firstCard === true) {
      this.counter = 0;
      this.showImage = true;
      this.showCard();
      this.firstCard = false;
    } else { // not first card
      this.counter = this.counter + 1;
      // console.log('in else counter = ' + this.counter);
      if (this.counter >= 53) {
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
    const realFinalArray = new Array<CardInfo>();

    finalRandomArray = shuffle(originalArray);

    // for (var i = 0; i <= finalRandomArray.length; i++) {
    //   realFinalArray[i + 1] = finalRandomArray[i];
    //   console.log(i);
    // }
    //
    //
    console.log(finalRandomArray);
    // console.log(realFinalArray);
    return finalRandomArray;
  }


  startTimer() {
    this.timerStartButtonName = 'Running';
    if(!this.isTimerStarted) {
      this.isTimerStarted = true;
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft++;
          this.showNewTime();
        } else {
          this.timeLeft = 0;
        }
      }, 1000);
    } else {
      this.timerStartButtonName = 'Running';
    }
  }
  showNewTime() {
    // console.log('timeleft=' + this.timeLeft);

    if (this.timeLeft <= 60) {
      this.newTime = this.timeLeft.toString();
    } else {
      this.newTime = (this.timeLeft / 60).toString() + 'minutes and ' + this.timeLeft.toString() + ' seconds';
    }
    this.myMinutes = (parseInt(String(this.timeLeft / 60), 10));
    this.mySeconds = this.timeLeft%60;
    // this.message = this.myMinutes + ' minutes' + (this.mySeconds ? ' and ' + this.mySeconds + ' seconds' : '');
    if(this.mySeconds<10){
      this.message = this.myMinutes + ':0' + (this.mySeconds);
    } else {
      this.message = this.myMinutes + ':' + (this.mySeconds);
    }

    // console.log(this.newTime);
  }
  pauseTimer() {
    this.timerStartButtonName = 'Restart';
    this.isTimerStarted = false;
    clearInterval(this.interval);
  }


}
