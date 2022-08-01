const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../models/auth/register')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');



router.post("", async (req, res) => {
    try {
        const users = req.body.workspaceUsers
        const allUsers = []
        for(var i = 0 ; i < users.length ; i++){
            const user = await authSchema.findOne({_id : users[i].toString()})
            allUsers.push(user)
        }

        res.send(allUsers)
        }

    catch(e){
        res.send(e)
    }
})



module.exports =
 router;