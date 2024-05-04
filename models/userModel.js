const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost:27017/pintrest');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    dp: {
        type: String
    },
    fullname: {
        type: String,
        required: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);