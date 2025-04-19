/**
 * Created by Doug on 2/21/16.
 */
const mongoose = require('mongoose');

module.exports = mongoose.model('Scores', {
    myWrongs: Array
});