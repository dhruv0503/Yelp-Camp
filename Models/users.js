const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pLM = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type : String,
        required : true,
        unique : true
    }
})

userSchema.plugin(pLM);

const User =  mongoose.model('User', userSchema);
module.exports = User;