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
        const workspace = await workSpaceSchema.find()
        const flip = []
        for(var i = 0 ; i < workspace.length ; i++){
            flip.unshift(workspace[i])
        }
        res.send(flip) 
    }

    catch (e) {
        res.send("Error")
    }
})



module.exports =
    router;