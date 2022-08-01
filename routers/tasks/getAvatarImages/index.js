const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const workSpaceSchema = require('../../../models/workspace')
const authSchema = require('../../../models/auth/register')
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');





//GET AVATAR



router.post("/", async (req, res) => {
    try {
        const person = req.body.person
        const personProfile  = await authSchema.findOne({_id : person.id})
            const data = {
                name:personProfile.username,
                img:personProfile.img,
                id:personProfile._id,
                status:person.status
            }


        res.send(data)
    }
    catch (e) {
        res.status(204).send(e)
    }
})


module.exports = router