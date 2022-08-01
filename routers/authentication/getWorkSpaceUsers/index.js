const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../models/auth/register')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const { response } = require('express')



router.post("/", async (req, res) => {
    try {
        const workspaceUsersId = req.body.workspaceUsers;
        const userArray = []
        for(var i = 0 ; i < workspaceUsersId.length ; i++){
            const user = await authSchema.findOne({_id:workspaceUsersId[i]})
            userArray.push(user)
        }
        
        res.send(userArray)


        }

    catch(e){
        res.send("error")
    }
})



module.exports =
 router;