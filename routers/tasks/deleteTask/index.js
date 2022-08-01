const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const workSpaceSchema = require('../../../models/workspace')
const authSchema = require('../../../models/auth/register')
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');





//DELETE TASK



router.post("/", async (req, res) => {
    try {
        const taskId = req.body.taskId.toString()
        const workSpaceId = req.body.workSpaceId
        const workSpace = await workSpaceSchema.findOne({ _id: workSpaceId })
        const tasks = workSpace.tasks
        const filteredTasks = tasks.filter(task => task.taskId != taskId)
        workSpace.tasks = filteredTasks
        const updateWorkSpace = await workSpaceSchema.findByIdAndUpdate(workSpaceId , workSpace)
        res.status(201).send("Task Deleted")
    }
    catch (e) {
        res.status(204).send(e)
    }
})


module.exports = router