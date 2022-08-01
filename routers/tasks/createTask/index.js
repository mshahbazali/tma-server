const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const workSpaceSchema = require('../../../models/workspace')
const authSchema = require('../../../models/auth/register')
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');





//CREATE TASK



router.post("/", async (req, res) => {
    try {
        const taggedPersons = req.body.taggedPersons
        const workspaceId = req.body.workSpaceId
        const taskCreatorId = req.body.taskCreatorId
        const taskCreator = await authSchema.findOne({_id : taskCreatorId})
        //updation of workspace
        const workspace = await workSpaceSchema.findOne({ _id: workspaceId })
        req.body.taskId = workspace.taskId
        const workspaceTask = workspace.tasks
        workspaceTask.unshift(req.body)
        workspace.tasks = workspaceTask;
        workspace.taskId = (Number(workspace.taskId)+1).toString()
        const updateWorkSpace = await workSpaceSchema.findByIdAndUpdate(workspaceId , workspace)
        
        // send notification to tagged person

        // var notification = {
        //     notificationMsg: taskCreator.username +"has tagged you in a task" + req.body.title,
        //     notificationType: "task",
        //     workspaceId:req.body.workSpaceId
        // }


        

        // for(var i = 0 ; i < taggedPersons.length ; i++){
        //     const _id = taggedPersons[i].id
        //     const taggedPerson = await authSchema.findOne({_id : _id})
        //     const notifications = taggedPerson.notifications
        //     notifications.unshift(notification)
        //     taggedPerson.notifications = notifications
        //     const updateTaggedPerson = await authSchema.findByIdAndUpdate(_id , taggedPerson)
        // }
        console.log(taskCreator)
       
        res.status(201).send(taskCreator)
    }
    catch (e) {
        res.status(204).send(e)
    }
})


module.exports = router