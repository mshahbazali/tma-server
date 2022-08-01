const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../models/auth/register')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')





//RESEt PASSWORD


router.post("/", async (req, res) => {
    try {
            var email = req.body.email;
            var password = req.body.password

            const user = await authSchema.findOne({email : email})
            const userId = user._id
            const securePass = await bcrypt.hash(password, 10)
            password = securePass;
            user.password = password;
            const updateUser  = await authSchema.findByIdAndUpdate(userId , user)
           res.status(201).send("Password Changed")
    }
    catch (e) {
        res.status(400).send(e)
    }
})







module.exports = router;