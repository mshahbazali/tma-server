const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../models/auth/register')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')




router.post("/", async (req, res) => {

  try {
    const email = req.body.email
    authSchema.find({ email: email })
      .exec()
      .then(async (user) => {
        if (user.length < 1) {
          res.status(204).send("User Not Found")
        }
        else {
          res.status(203).send("User found")
        }
      })
      .catch(e => {
        res.status(205).send({ message: "User Not Found", user: 'false' })
      })
  }
  catch (e) {
    res.status(202).send({ message: "User Not Found", user: 'false' })
  }

})


module.exports = router