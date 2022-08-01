const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../models/auth/register')
const workSpaceSchema = require('../../../models/workspace')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');



router.post("/", async (req, res) => {
    try {
        const userId = req.body.userId
        const user = await authSchema.findOne({_id : userId})
        const recenetWorkSpaces = []
        const userWorkspace = user.recentWorkSpaces
        for(var i = 0 ; i < userWorkspace.length ; i ++){
            const workspaceId = userWorkspace[i]
            const workspace = await workSpaceSchema.findOne({_id : workspaceId})
            recenetWorkSpaces.push(workspace)
        }
        res.send(recenetWorkSpaces) 
    }

    catch (e) {
        res.send(e)
    }
})



module.exports =
    router;