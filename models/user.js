const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if (validator.contains('password',value)){
                throw new Error('Password can not contain the word password')
            }
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'playlists'
    }
})

const User = mongoose.model('users',UserSchema)

module.exports = User