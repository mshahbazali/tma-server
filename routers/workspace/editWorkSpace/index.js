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



//MULTER



// Data Create 
const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});




//EDIT WORKSPACE

router.patch("/", async (req, res) => {
    try {
        const _id = req.body.id;
        const workspace = await workSpaceSchema.findOne({_id : _id});
        workspace.workSpaceName = req.body.workspaceName
        const updatedWorkSpace = await workSpaceSchema.findByIdAndUpdate(_id , workspace)
        res.send({
            message:"Workspace Edited",
            editedWorkSpace:updatedWorkSpace
        })

    }

    catch (e) {
        res.send(e)
    }
})




//EDIT WORKSPACE IMAGE


router.patch("/img",upload.single("workSpaceImage") ,async (req, res) => {
    try {
        if (req.file) {
            const url = req.protocol + '://' + req.get('host')
            req.body.workSpaceImage = url + '/public/' + req.file.filename;
            
            const _id = req.body.id;
            const workspace = await workSpaceSchema.findOne({_id : _id});
            workspace.workSpaceImage = req.body.workSpaceImage;

            const updatedWorkSpace = await workSpaceSchema.findByIdAndUpdate(_id , workspace)
            res.send({
                message:"Picture Edited Successfully",
                updatedWorkSpace:workspace
            })
        }else {
            res.send("File not found")
        }
    }

    catch (e) {
        res.send(e)
    }
})



module.exports =
    router;