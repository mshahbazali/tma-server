const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../models/auth/register')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');



router.get("/get-users", async (req, res) => {
    try {
        const allUsers = await authSchema.find();
        res.send(allUsers)
        }

    catch(e){
        res.send(e)
    }
})



module.exports =
 router;