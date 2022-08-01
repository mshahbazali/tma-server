const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const workSpaceSchema = require('../../../../../models/workspace')
const authSchema = require('../../../../../models/auth/register')
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');





//REQUEST ACCEPT BY USER



router.post("/", async (req, res) => {
    try {

        //workspace updation
        const userId = req.body.userId
        const workSpaceid = req.body.workSpaceId
        const workSpace = await workSpaceSchema.findOne({ _id: workSpaceid })
        const user = await authSchema.findOne({ _id: userId })
        const workSpaceRequestedUsers = workSpace.requestedUsers
        const filtered = workSpaceRequestedUsers.filter(users => users == !userId)
        workSpace.requestedUsers = filtered
        const workSpaceUsers = workSpace.users
        workSpaceUsers.push(userId)
        workSpace.users = workSpaceUsers
        const updatedWorkspace = await workSpaceSchema.findByIdAndUpdate(workSpaceid , workSpace)
        

        
        //user updation
        const requests = user.requests
        const filteredRequests = requests.filter(request => request == !workSpaceid)
        const workSpaces = user.workspace
        workSpaces.push(workSpaceid)
        user.workspace = workSpaces
        user.requests = filteredRequests
        const updateUserWorkSpace = await authSchema.findByIdAndUpdate(userId , user)


        
        //admin updation
        
        const notification = {
            notificationMsg: `${user.username} accepted your request of ${workSpace.workSpaceName}`,
            notificationType: "workspaceReqAccepted",
            workspaceId: workSpaceid
        }

        const adminId = workSpace.adminId;
        const admin = await authSchema.findOne({_id:adminId});
        const adminNotifications = admin.notifications;
        adminNotifications.unshift(notification)
        admin.notifications = adminNotifications;

        const updateAdmin = await authSchema.findByIdAndUpdate(adminId , admin)


        res.status(201).send("Request Accepted")
    }
    catch (e) {
        res.status(204).send(e)
    }
})


module.exports = router