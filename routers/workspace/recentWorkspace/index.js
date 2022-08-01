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
        const userId = req.body.userId;
        const workspaceId = req.body.workspaceId
        const user = await authSchema.findOne({_id : userId})
       const userRecent = user.recentWorkSpaces

       var already;
       
        if(userRecent.length !== 0 ){
            for(var i = 0 ; i < userRecent.length ; i++){
                if(userRecent[i] === workspaceId){
                    userRecent.splice(i,1)
                    already = true
                }
            }
        }

            userRecent.unshift(workspaceId)
            if(userRecent.length === 6){
                userRecent.pop()
            }

        user.recentWorkSpaces = userRecent

        const updateUser = await authSchema.findByIdAndUpdate(userId , user)


       res.send("Recent Workspace Added")



    }

    catch (e) {
        res.send(e)
    }
})



module.exports =
    router;