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
        const _id = req.body.id
        const workspace = await workSpaceSchema.findOne({_id: _id})
        const workspaceUsers = workspace.users
        if(workspaceUsers.length !==1 || workspaceUsers.length !== 0){
            for(var i = 0 ; i < workspaceUsers.length ; i++){
                const userId = workspaceUsers[i]
                const user = await authSchema.findOne({_id : userId})
                const userWorkspace = user.workspace;
                const recent = user.recentWorkSpaces
                const filteredRecent = recent.filter(workspace => workspace.toString() !== _id.toString())
                const filteredWorkspace = userWorkspace.filter(workspace => workspace.toString() !== _id.toString())
                user.workspace = filteredWorkspace;
                user.recentWorkSpaces = filteredRecent
                const updateUser = await authSchema.findByIdAndUpdate(userId , user)  
            }
        }
        const deleteWorkSpace = await workSpaceSchema.findByIdAndDelete(_id)
        res.status(201).send("Deleted")
        }

    catch(e){
        res.status(204).send("e")
    }
})



module.exports =
 router;