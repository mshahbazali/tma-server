const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../models/auth/register')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');




//EDIT PROFILE


router.patch("/edit-profile", async (req,res)=>{
    const email = req.body.email;
    const user = await authSchema.findOne({email : email});

    const data = user;
    data.username = req.body.username;
    data.phone = req.body.phone
    data.img = req.body.img
    const _id = user._id;
    const updateProfile = await authSchema.findByIdAndUpdate(_id,data,{
      new:true
    })
    res.send(data)


})






module.exports = router;