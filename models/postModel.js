const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/pintrest');

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    posttext: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Post', postSchema);