const express = require('express')
const route = express.Router()
const Comment = require('../Models/comment')
const checkauth = require('../../middlewares/check-auth')
const User = require("../Models/User");


route.post('/add',checkauth,(req,res)=>{
  const  comment = new Comment({
      idcomment :req.body.id ,
      name : req.body.name,
      imagepath : req.body.img,
      content:req.body.comment,
      iduser : req.userData.userId,
  }).save().then(comment=>{
      res.status(200).json({cm :comment})
  },err=>{
      console.log(err)
  })
})
route.post('/getComments',(req,res)=>{
    Comment.find({ 'idcomment' :req.body.id}).then(commnets=>{
        res.status(200).json(commnets)
    },err=>{
        console.log(err)
    })
})

module.exports = route
