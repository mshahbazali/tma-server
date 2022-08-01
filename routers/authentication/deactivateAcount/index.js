const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../models/auth/register')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const workspaceSchema = require('../../../models/workspace')




//DEACTIVATE ACOUNT


router.post("/", async (req, res) => {
  try {
    const userId = req.body.userId
    const user = await authSchema.findOne({ _id: userId })
    workspaceSchema.find({ adminId: userId })
      .exec()
      .then(async (workspace) => {
        if (workspace.length === 0) {
          console.log("No workspace")
        } else {
          for (var i = 0; i < workspace.length; i++) {
            const workspaceId = workspace[i]._id
            const workspaceUsers = workspace[i].users
            for (var j = 0; j < workspaceUsers.length; j++) {
              const workspaceUserId = workspaceUsers[j].toString()
              const getUser = await authSchema.findOne({ _id: workspaceUserId })
              const userWorkspaces = getUser.workspace
              const recentWorkspaces = getUser.recentWorkSpaces
              const filteredWorkspaces = userWorkspaces.filter(workspace => workspace.toString() !== workspaceId.toString())
              const filteredRecent = recentWorkspaces.filter(workspace => workspace.toString() !== workspaceId.toString())
              getUser.workspace = filteredWorkspaces
              getUser.recentWorkSpaces = filteredRecent
              const updateUser = await authSchema.findByIdAndUpdate(workspaceId , getUser)
            }
            const deleteWorkspace = await workspaceSchema.findByIdAndDelete(workspaceId)
          }
          const deleteUser = await authSchema.findByIdAndDelete(userId)
        }
      })
    res.send("Acount Deleted")
  }
  catch (e) {
    res.status(204).send("e")
  }
});

















module.exports = router;