const mongoose = require('mongoose')
const chatSchema = new mongoose.Schema({
    workspace_name: {
        type: String,
    },
    workspace_id: {
        type: String,
    },
    workspace_users: {
        type: Array,
    },

})

module.exports = new mongoose.model('chat', chatSchema);