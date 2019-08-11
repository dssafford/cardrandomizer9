const express = require('express')
const app = express()
const mongoose = require('mongoose');
const url = 'mongodb://0.0.0.0:9095/dougTestRandomizer';
const bodyParser = require('body-parser')
const User = require('./model/user');
const testsSchema = require('./schemas/test');
const scoreSchema = require('./schemas/scores');

const journals = require('./data/10CardsTest');
const masterAnswers = new Array;
let dougTestArray = new Array;
let dougWrongArray = new Array;



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});


app.get('/api/user/login', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/user/login', (req, res) => {
    mongoose.connect(url, function(err){
        if(err) throw err;
        console.log('connected successfully ');
    });
})


app.post('/api/enterTest',function(req, res) {
    //below outputs full response to browser in json format 
    //console.log(res.json(req.body)); 

    //below outputs full response to browser in json format 
    // console.log(res.json(req.body));
    // dougWrongArray = req.body.myWrongs;

    dougWrongArray = req.body;

    console.log('wrong answers  = ' + dougWrongArray);

    mongoose.connect(url, function(err){
        if(err) throw err;
        console.log('connected successfully ');
    });

    //Save all data to database
    let record = new scoreSchema();
    record.myWrongs = dougWrongArray;

    record.save(function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                status: 'failure'
            });
        } else {
            console.log('No error saving test to database');
            // res.json({status: 'success'});
            // res.redirect('/home'); 
        }
    });

    // res.write('eat shit doug');
    // console.log("Answers 1 ="+ answers[0]);
    res.end();

});


// Add the record data to database, from POST on form submit
app.post('/api/enteranswers',function(req, res) {
    //below outputs full response to browser in json format 
    //console.log(res.json(req.body)); 

    //below outputs full response to browser in json format 
    // console.log(res.json(req.body));

    // dougTestArray = JSON.stringify(req.body.name);

    dougTestArray = JSON.stringify(req.body.name);
    console.log('dougTestArray  = ' + dougTestArray);


    mongoose.connect(url, function(err){
        if(err) throw err;
        console.log('connected successfully ');
    });


    var testAnswers = CreateAnswerArrayRepository(req);

    var masterAnswers = CreateMasterAnswers();

    //Compare Arrays to find any problems
    var testArray = CompareArrays(testAnswers, masterAnswers);

    //Save all data to database
    var record = new testsSchema();
    record.userid = 1;
    record.timestamp = Date.now();
    record.masterList = masterAnswers;
    record.answerList = testAnswers;
    record.scoreList = testArray;
    record.comments = req.body.comments;

    record.save(function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                status: 'failure'
            });
        } else {
            console.log('No error saving test to database');
            // res.json({status: 'success'});
            // res.redirect('/home'); 
        }
    });

    // res.write('eat shit doug');
    // console.log("Answers 1 ="+ answers[0]);
    res.end();


});


function CompareArrays(one, two) {
    scoresArray = new Array;

    for(i=0;i<one.length;i++){
        if(one[i] != two[i]) {
            scoresArray.push(false);
            console.log("Found not equal on number: " + i.toString() + " - " + one[i] + " != " + two[i]);
        } else {
            scoresArray.push(true);
        }
    }
    return scoresArray;


}

function CreateMasterAnswers() {


    for(var exKey in journals) {
        masterAnswers.push(journals[exKey].cardname);

        // console.log("creating master list == key:"+exKey+", value:"+journals[exKey].cardname);

    }

    return masterAnswers;

}
function CreateAnswerArrayRepository() {
    var answers = new Array;
    answers.push("10_of_clubs");
    answers.push("10_of_diamonds");
    answers.push("6_of_spades");
    answers.push("king_of_diamonds");
    answers.push("4_of_spades");
    answers.push("10_of_hearts");
    answers.push("jack_of_diamonds");
    answers.push("7_of_clubs");
    answers.push("6_of_hearts");
    answers.push("2_of_spades");
    answers.push("3_of_spades");
    answers.push("4_of_spades");
    answers.push("5_of_spades");
    answers.push("6_of_spades");
    answers.push("7_of_spades");
    answers.push("8_of_spades");
    answers.push("9_of_spades");
    answers.push("10_of_spades");
    answers.push("2_of_diamonds");
    answers.push("3_of_diamonds");


    exports.answersArray = answers;

    return answers;
}

app.listen(3000, () => console.log('blog server running on port 3000!'))