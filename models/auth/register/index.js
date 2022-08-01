const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: false,
        trim: true
    },
    email: {
        type: String,
        // unique: true,
        // trim: true
    },
    password: {
        type: String,
        unique: false,
        trim: true
    },
    verified: {
        type: String,
    },
    otp: {
        type: String,
        unique: false
    },
    img: {
        type: String
    },
    phone: {
        type: String
    },
    workspace: {
        type: Array
    },
    notifications: {
        type: Array
    },
    requests: {
        type: Array,
        unique: false
    },
    requestSent: {
        type: Array
    },
    recentWorkSpaces: {
        type: Array
    }
})

const user = new mongoose.model('user', userSchema)

module.exports = user;