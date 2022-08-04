const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const workSpaceSchema = require('../../../../../models/workspace')
const authSchema = require('../../../../../models/auth/register')
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');





//REQUEST ACCEPT BY ADMIN



router.post("/", async (req, res) => {
    try {

        // workspace updation

        const userId = req.body.userId
        const workSpaceid = req.body.workSpaceId
        const workSpace = await workSpaceSchema.findOne({ _id: workSpaceid })
        const userRequests = workSpace.userRequests
        const filtered = userRequests.filter(users => users == !userId)
        workSpace.userRequests = filtered
        const workSpaceUsers = workSpace.users
        workSpaceUsers.push(userId)
        workSpace.users = workSpaceUsers
        const updatedWorkspace = await workSpaceSchema.findByIdAndUpdate(workSpaceid, workSpace)


        //user updation

        const notification = {
            notificationMsg: `${workSpace.admin} accepted your request to join ${workSpace.workSpaceName}`,
            notificationType: "workspaceReqAccepted",
            workspaceId: workSpaceid,
        }

        const user = await authSchema.findOne({ _id: userId })
        const requestSent = user.requestSent
        const filteredRequests = requestSent.filter(request => request == !workSpaceid)
        const workSpaces = user.workspace
        workSpaces.push(workSpaceid)
        user.workspace = workSpaces
        user.requestSent = filteredRequests
        const userNotifications = user.notifications
        userNotifications.unshift(notification)
        user.notifications = userNotifications
        const updateUserWorkSpace = await authSchema.findByIdAndUpdate(userId, user)

        // admin updation


        const digit = req.body.digit
        const adminId = workSpace.adminId
        const admin = await authSchema.findOne({ _id: adminId })
        const adminNotifications = admin.notifications
        adminNotifications[digit].status = "true"
        admin.notifications = adminNotifications

        const updateAdmin = await authSchema.findByIdAndUpdate(adminId, admin)

        res.status(201).send("Request Sent Successfully")
    }
    catch (e) {
        res.status(204).send(e)
    }
})


module.exports = router