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



router.get("/", async (req, res) => {
    try {
        const workSpaceId = req.body.workSpaceId
        const workSpace = await workSpaceSchema.findOne({ _id: workSpaceId })
        const tasks = workSpace.tasks
        for(var i = 0 ; i < tasks.length ; i++){
            const taskCreatorName = await authSchema.findOne({_id : tasks[i].taskCreatorId})
            tasks[i].taskCreatorName = taskCreatorName
        }
        res.status(201).send(tasks)
    }
    catch (e) {
        res.status(204).send(e)
    }
})


module.exports = router