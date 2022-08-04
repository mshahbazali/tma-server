const mongoose = require('mongoose')
const express = require('express')
const router = new express.Router()
const workSpaceSchema = require('../../../models/workspace')
const authSchema = require('../../../models/auth/register')
const nodemailer = require("nodemailer")




//CREATE WORKSPACE



router.post("/create-workspace", async (req, res) => {
    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const date = new Date()
    const adminEmail = req.body.adminEmail;
    const adminData = await authSchema.findOne({ email: adminEmail });
    const admin = adminData.username
    const adminDataId = adminData._id;
    req.body.createdDate = months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear()
    req.body.adminId = adminDataId
    req.body.admin = admin
    req.body.users = []
    req.body.users.push(adminDataId)
    req.body.tasks = []
    req.body.taskId = "2000"
    req.body.requestedUsers = []
    req.body.adminImg = adminData.img
    const workSpaceName = req.body.workSpaceName;
    const workSpace = await workSpaceSchema.findOne({ workSpaceName: workSpaceName });;
    if (workSpace) {
        res.status(202).send("This workspace name is already exist, Please try another")
    } else {

        const addWorkSpace = await new workSpaceSchema(req.body);
        addWorkSpace.save()
            .then(async (data) => {
                const getWorkSpace = await workSpaceSchema.findOne({ workSpaceName: req.body.workSpaceName })
                const workSpaceid = getWorkSpace._id
                const adminWorkSpaces = adminData.workspace
                adminWorkSpaces.push(workSpaceid)
                adminData.workspace = adminWorkSpaces
                const updateAdmin = await authSchema.findByIdAndUpdate(adminDataId, adminData)
                res.status(201).send(data)
            })
    }


})


module.exports = router