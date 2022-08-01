const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const workSpaceSchema = require('../../../../models/workspace')
const authSchema = require('../../../../models/auth/register')
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');





//REQUEST BY ADMIN



router.post("/", async (req, res) => {

    try {

        
        const id = req.body.workSpaceId;
        const requestedUserId = req.body.requestedUserId
        const requestedUser = await authSchema.findOne({ _id: requestedUserId });
        const workSpace = await workSpaceSchema.findOne({ _id: id });
        const adminUserName = workSpace.admin
        const requestedUsers = workSpace.requestedUsers


        //notification
        
        const notification = {
            notificationMsg:`${adminUserName} requested you to join their workspace ${workSpace.workSpaceName}`,
            notificationType:"workspaceReqByAdmin",
            workspaceId:id,
            userId:requestedUserId,
            // status:"false"
        }
        const notifications = requestedUser.notifications
        const requests = requestedUser.requests
        notifications.unshift(notification)
        requests.unshift(id)
        requestedUser.notifications = notifications;
        requestedUser.requests = requests
        requestedUsers.unshift(requestedUserId)
        workSpace.requestedUsers = requestedUsers
        const updateWorkSpace = await workSpaceSchema.findByIdAndUpdate(id, workSpace)
        const updateRequestedUser = await authSchema.findByIdAndUpdate(requestedUserId, requestedUser)
        res.status(201).send("Request Send")
    }
    catch (e) {
        res.status(204).send(e)
    }
})


module.exports = router