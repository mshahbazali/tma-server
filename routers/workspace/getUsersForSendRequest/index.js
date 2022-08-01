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

        //get all users
        const userId =  req.body.userId;
        const getAllUsers = await authSchema.find();
        const filteredUsers = getAllUsers.filter(user => user._id.toString() !== userId.toString())


        res.send(filteredUsers)
    }

    catch (e) {
        res.send("errorr")
    }
})



module.exports =
    router;