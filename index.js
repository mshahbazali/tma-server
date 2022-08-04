const express = require('express')
const app = express();
const http = require('http').createServer(app)
require('./db/connect')
const cors = require('cors')
const io = require('socket.io')(http)
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
const chatSchema = require('./models/chat')
const messageSchema = require('./models/message')




const register = require('./routers/authentication/register')
const resetPassword = require('./routers/authentication/resetPassword')
const editProfile = require('./routers/authentication/editProfile')
const createWorkspace = require('./routers/workspace/createWorkspace')
const getUsers = require('./routers/authentication/getUsers')
app.use("/auth/login", require('./routers/authentication/login'))
app.use("/workspace/request-by-admin", require('./routers/workspace/addToWorkSpaceRequest/requestByAdmin'))
app.use("/workspace/request-accept-byUser", require('./routers/workspace/addToWorkSpaceRequest/requestAccept/requestAcceptByUser'))
app.use("/workspace/create-task", require('./routers/tasks/createTask'))
app.use("/workspace/edit-task", require('./routers/tasks/editTask'))
app.use("/workspace/get-tasks", require('./routers/tasks/getTasks'))
app.use("/workspace/edit", require('./routers/workspace/editWorkSpace'))
app.use("/workspace/myWorkspace/get", require('./routers/workspace/getWorkspaces'))
app.use("/workspace/delete", require('./routers/workspace/deleteWorkSpace'))
app.use("/workspace/request-by-user", require('./routers/workspace/addToWorkSpaceRequest/requestByUser'))
app.use("/workspace/request-accept-byAdmin", require('./routers/workspace/addToWorkSpaceRequest/requestAccept/requestAcceptByAdmin'))
app.use("/workspace/getNew", require('./routers/workspace/getNewWorkspace'))
app.use("/workspace/getRecent", require("./routers/workspace/getRecentWorkSpaces"))
app.use("/workspace/getUsers", require('./routers/authentication/getWorkSpaceUsers'))
app.use("/workspace/task/getAvatar", require('./routers/tasks/getAvatarImages'))
app.use("/workspace/task/statusupdate", require("./routers/tasks/taskCompleted"))
app.use("/single/get-user", require('./routers/authentication/getSingleUser'))
app.use("/workspace/current/get", require('./routers/workspace/currentWorkspace'))
app.use("/user/notifications/get", require('./routers/authentication/getNotifications'))
app.use("/workspace/get-user/forsendRequest", require('./routers/workspace/getUsersForSendRequest'))
app.use("/workspace/setRecent", require('./routers/workspace/recentWorkspace'))
app.use("/workspace/get/recent", require('./routers/workspace/getRecentWorkSpaces'))
app.use("/workspace/task/delete", require('./routers/tasks/deleteTask'))
app.use('/auth/deactivate-acount', require('./routers/authentication/deactivateAcount'))
app.use('/workspace/leave', require('./routers/workspace/leaveWorkspace'))
app.use('/workspace/getUsers-fortag', require('./routers/tasks/getUsersFotTag'))
app.use('/user/forgot-password', require('./routers/authentication/forgotPassword'))
app.use('/user/reset-password', require('./routers/authentication/resetPassword'))
app.use(register)
app.use(resetPassword)
app.use(createWorkspace)
app.use(editProfile)
app.use(getUsers)



// Chat 

// Create Workspace Chat 

const users = []

// app.post("/workspace/chat/create", async (req, res) => {
//     const { workspace_id } = req.body
//     const registerWorkspace = await chatSchema.findOne({ workspace_id })
//     if (registerWorkspace) {
//         const exist = users.find(user => user.workspace_id === workspace_id && user.user_id === user_id);
//         if (exist) {
//             console.log(`This Workspace is already registered`)
//         }
//     }
//     else {
//         const user = { socket_id: req.body.socket_id, user_name: req.body.user_name, user_id: req.body.user_name, workspace_id: req.body.workspace_id };
//         users.push(user)
//         req.body.workspace_users = [...registerWorkspace.workspace_users, user]
//         const addWorkspace = new chatSchema(req.body)
//         addWorkspace.save()
//         console.log(users);
//         console.log(`Workspace register in chat`)
//     }
// })

io.on("connection", (socket) => {
    socket.on('create-workspace', (user) => {
        const userData = { socket_id: socket.id, user_name: user.user_name, user_id: user.user_id, workspace_id: user.workspace_id };
        users.push(userData)
        console.log(users);
        const workspaceData = { workspace_name: user.workspace_name, workspace_id: user.workspace_id, workspace_users: user.workspace_users }
        const addWorkspace = new chatSchema(workspaceData)
        addWorkspace.save().then((res) => {
            socket.emit('created', res)
        })


    })
    socket.on("join", (user) => {
        const exist = users.find(allUser => allUser.workspace_id === user.workspace_id && allUser.user_id === user.user_id);
        if (exist) {
            console.log('user already added');
        }
        else {
            const userData = { socket_id: socket.id, user_name: user.user_name, user_id: user.user_id, workspace_id: user.workspace_id };
            users.push(userData)
            console.log(users);
            const addWorkspace = new chatSchema({ workspace_users: user.workspace_users })
            addWorkspace.save().then((res) => {
                socket.emit('added', res)
            })
        }
    })
    socket.on("sendMessage", (data) => {
        const getUser = (socket_id) => users.find(user => user.socket_id === socket_id)
        const user = getUser(socket.id)
        console.log(user);
        if (user) {
            const msgToStore = {
                user_name: user.user_name,
                user_id: user.user_id,
                workspace_id: data.workspace_id,
                text: data.text
            }
            const msg = new messageSchema(msgToStore);
            msg.save().then(result => {
                io.to(data.workspace_id).emit('message', result);
                callback()
            })
        }
        else {
            const msgToStore = {
                user_name: data.user_name,
                user_id: data.user_id,
                workspace_id: data.workspace_id,
                text: data.text
            }
            const msg = new messageSchema(msgToStore);
            msg.save().then(result => {
                io.to(data.workspace_id).emit('message', result);
            })
        }


    })
    socket.on('get-messages-history', (workspace_id) => {
        messageSchema.find({ workspace_id }).then(result => {
            socket.emit('output-messages', result)
        })
    })
});







http.listen(port, () => {
    console.log(`server running on port ${port} `)
})