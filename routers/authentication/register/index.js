const mongoose = require('mongoose')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = new express.Router()
const authSchema = require('../../../models/auth/register')
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




//Registeration


router.post("/register", async (req, res) => {
  try {
    const { email } = req.body
    const user = await authSchema.findOne({ email: req.body.email });
    if (user) {
      res.status(202).send('The email already exist')
    } else {


      const otp = Math.floor(1000 + Math.random() * 9000);
      const securePass = await bcrypt.hash(req.body.password, 10)
      req.body.password = securePass
      req.body.otp = otp;
      req.body.notifications = []
      req.body.requests = []
      req.body.workspace = []
      const addUser = new authSchema(req.body)
      addUser.save()
        .then(() => {
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'tmaapp1@gmail.com',
              pass: 'hpmuirhytnyrgtzh'
            }
          });
          var mailOptions = {
            from: 'tmaapp1@gmail.com',
            to: req.body.email,
            subject: 'OTP',
            text: `Please enter ${otp} in your Trello app to verufy your acount`
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }

          });

          setTimeout(async () => {
            const user = await authSchema.findOne({email:req.body.email})
            const _id = user._id
            req.body.otp = null;
            const updateauth = await authSchema.findByIdAndUpdate(_id , req.body)
          }, 500000);
        })
      res.send(req.body)
    }

  }
  catch (e) {
    res.status(204).send(e)
  }
});




// OTP verification


router.post("/verify", async (req, res) => {
  try {
    let user = await authSchema.findOne({ otp: req.body.otp });
    if (!user) {
      return res.status(204).send({ message: 'Your One Time Verification Code is Invalid' });
    } else {
      const data = user
      const _id = user._id
      data.verified = "true";
      data.otp = null
      const updateauth = await authSchema.findByIdAndUpdate(_id, data, {
        new: true
      })
      res.status(202).send({ message: "Your account was created successfully!" })
    }

  }
  catch (err) {
    res.status(203).send({ message: "Please fill valid information" })
  }
})



//RESEND OTP




router.post("/resend", async (req, res) => {
  try {
    var user = await authSchema.findOne({ email: req.body.id });
    if (!user) {
      return res.status(202).send({ message: 'User Not Found' });
    } else {
      var _id = user._id
      const otp = Math.floor(1000 + Math.random() * 9000);
      user.otp = otp;
      const updateUser = await authSchema.findByIdAndUpdate(_id , user)
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tmaapp1@gmail.com',
          pass: 'hpmuirhytnyrgtzh'
        }
      });
      var mailOptions = {
        from: 'tmaapp1@gmail.com',
        to: req.body.id,
        subject: 'OTP',
        text: `Please enter ${otp} in your Trello app to verify your acount`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to: ${req.body.id} ` + info.response);
        }

      });

      setTimeout(async () => {
        const user = await authSchema.findOne({email:req.body.id})
        const _id = user._id
        req.body.otp = null;
        const updateauth = await authSchema.findByIdAndUpdate(_id , req.body)
      }, 30000);



     
      console.log("Email Sent")
      res.status(202).send({ message: "Otp Send Sucessfully" })
    }
  }
  catch (err) {
    res.status(202).send({ message: "Please fill valid information" })
  }
})












module.exports = router;