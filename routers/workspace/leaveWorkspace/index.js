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
        const workspace = await workSpaceSchema.findOne({_id:req.body.workspaceId})
        const user = await authSchema.findOne({_id : req.body.userId})
        const workspaceUsers = workspace.users
        const filteredUsers = workspaceUsers.filter(user => user.toString() !== req.body.userId.toString())
        workspace.users = filteredUsers;
        const userWorkspace = user.workspace;
        const userRecent = user.recentWorkSpaces
        const filteredRecent = userRecent.filter(workspace => workspace.toString() !== req.body.workspaceId.toString())
        const filteredWorkspace = userWorkspace.filter(workspace => workspace.toString() !== req.body.workspaceId.toString())
        user.workspace = filteredWorkspace
        user.recentWorkSpaces = filteredRecent
        const updateUser = await authSchema.findByIdAndUpdate(req.body.userId , user)
        const updateWorkspace = await workSpaceSchema.findByIdAndUpdate(req.body.workspaceId,workspace)
        res.send(`You Leaved Workspace ${workspace.workSpaceName}`)
        }

    catch(e){
        res.status(204).send("e")
    }
})



module.exports =
 router;