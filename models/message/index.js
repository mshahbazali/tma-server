const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },
    workspace_id: {
        type: String,
    },
    user_name: {
        type: String,
    },
    text: {
        type: String,
    },

})

const message = new mongoose.model('message', messageSchema)

module.exports = message;