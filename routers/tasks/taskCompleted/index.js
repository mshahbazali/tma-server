const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const workSpaceSchema = require('../../../models/workspace')
const authSchema = require('../../../models/auth/register')
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');





//GET AVATAR



router.post("/", async (req, res) => {
    try {
        const workspaceId = req.body.workspaceId
        const index = req.body.taskIndex
        const userId = req.body.userId.toString()
        const workspace = await workSpaceSchema.findOne({ _id: workspaceId })
        const taggedPersons = workspace.tasks[index].taggedPersons;
        for (var i = 0; i < taggedPersons.length; i++) {
            if (taggedPersons[i].id.toString() === userId) {
                taggedPersons[i].status = "Completed"
            }
        }
        workspace.tasks[index].taggedPersons = taggedPersons
        const updateWorkspace = await workSpaceSchema.findByIdAndUpdate(workspaceId , workspace)
        


        // send notification to creator
        const findUser = await authSchema.findOne({_id : req.body.userId})
        const taskCreatorId = req.body.taskCreatorId
        const creator = await authSchema.findOne({ _id: taskCreatorId })
        const notification = {
            notificationMsg: `${findUser.username} has completed the task ${workspace.tasks[index].title} in ${workspace.workSpaceName}`,
            notificationType: "taskCompleted",
            workspaceId: workspaceId
        }
        const notifications = creator.notifications
        notifications.unshift(notification)
        creator.notifications = notifications;
        const updateCreator = await authSchema.findByIdAndUpdate(taskCreatorId , creator)
        res.send("Task completed")
    }
    catch (e) {
        res.status(204).send(e)
    }
})


module.exports = router