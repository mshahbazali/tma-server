const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../../models/auth/register')
const workSpaceSchema = require('../../../../models/workspace')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');



router.post("/", async (req, res) => {
    try {
        const workspaceId = req.body.workspaceId
        const userId = req.body.userId
        const findWorkspace = await workSpaceSchema.findOne({ _id: workspaceId })
        const adminId = findWorkspace.adminId
        const admin = await authSchema.findOne({_id : adminId})
        const adminNotification = admin.notifications 
        const userRequests = findWorkspace.userRequests
        const user = await authSchema.findOne({ _id: userId })
        const notification = {
            notificationMsg:`${user.username} has requested to join your workspace ${findWorkspace.workSpaceName}`,
            notificationType:"workspaceReqByUser",
            workspaceId:workspaceId,
            userId : userId,
            status:"false"
        }
        const requestFromUser = user.requestSent
        var role;

        for (var i = 0; i < userRequests.length; i++) {
            if (userRequests[i] === userId) {
                role = 2
                break;
            }
        }

        if (role == 2) {
            res.send("Already Sent Request")
        } else {
            requestFromUser.push(workspaceId)
            user.requestSent = requestFromUser
            userRequests.push(userId)
            findWorkspace.userRequests = userRequests
            const updateWorkspace = await workSpaceSchema.findByIdAndUpdate(workspaceId, findWorkspace)
            const updateUser = await authSchema.findByIdAndUpdate(userId, user)
            adminNotification.unshift(notification)
            admin.notifications = adminNotification
            const updateAdmin = await authSchema.findByIdAndUpdate(adminId , admin)
            res.status(201).send("Request Sent")
        }
    }

    catch (e) {
        res.send("Error")
    }
})



module.exports = router;