/**
 * Created by Doug on 2/21/16.
 */
const mongoose = require('mongoose');

module.exports = mongoose.model('Tests', {
    userid: Number,
    timestamp: Number,
    masterList: Array,
    answerList: Array,
    scoreList: Array,
    comments: String
});