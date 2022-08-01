const mongoose = require('mongoose')


const workSpaceSchema = new mongoose.Schema({
    admin: {
        type: String,
        unique: false,
        trim: true
    },
    about: {
        type: String
    },
    adminId: {
        type: String,
        unique: false
    },
    workSpaceName: {
        type: String,
        unique: true,
        trim: true
    },
    workSpaceImage: {
        type: String,
        unique: false,
        trim: true
    },
    tasks: {
        type: Array,
    },
    createdDate: {
        type: String
    },
    requestedUsers: {
        type: Array
    },
    users: {
        type: Array
    },
    userRequests: {
        type: Array
    },
    adminImg: {
        type: String
    },
    taskId:{
        type:String,
        unique:false
    }

})

const workSpace = new mongoose.model('workspace', workSpaceSchema)

module.exports = workSpace;