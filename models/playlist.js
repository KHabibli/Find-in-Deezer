const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    artist : {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

const Playlist = mongoose.model('playlist', playlistSchema)

module.exports = Playlist