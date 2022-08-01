const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../models/auth/register')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');



router.post("/", async (req, res) => {
    try {
        const userId = req.body.id;
        const user = await authSchema.findOne({ _id: userId })
        res.send(user)
    }

    catch (e) {
        res.send(e)
    }
})

router.get("/me", async (req, res) => {
    try {
        jwt.verify(req.headers.token, "trello_secret", function (err, decoded) {
            const _id = decoded.id
            authSchema.findOne({ _id: _id }, async (err, user) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.status(201).send(user)
                }
            }
            )
        });

    }
    catch (e) {
        res.status(204).send(e)
    }
})



module.exports =
    router;