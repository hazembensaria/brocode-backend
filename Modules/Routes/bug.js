const express = require('express')
const route = express.Router()
const Bug= require('../Models/bug')
const Share= require('../Models/share')
const checkauth = require('../../middlewares/check-auth')
const User = require("../Models/User");



route.post('/add',checkauth,(req,res)=>{
    const  comment = new Bug({

        name :req.body.name,
        userimg :req.body.imagepath,
        iduser : req.userData.userId,
        content :req.body.content,
        title :req.body.title,
        tags : req.body.tags
    }).save().then(bug=>{
        res.status(200).json({cm :comment})
    },err=>{
        console.log(err)
    })
})


route.get("" ,(req ,res)=>{
Bug.find().sort({date : -1}).then(bugs=>{
        res.status(201).json(bugs)
    },err=>{
        console.log('something went wrong '+ err)
    })
})

route.post('/share',checkauth,(req,res)=>{

    for(let i of req.body.ids){
        const share = new Share({
            imagepath :req.body.image,
            title :req.body.title,
            name:req.body.name,
            idpost : req.body.idBug,
            idshare : req.userData.userId,
            idreceve : i ,
        }).save().then(share=>{
            console.log(share)
        },err=>{

            console.log(err)
        })
    }

})

route.get("/getShares" ,checkauth,(req ,res)=>{
    Share.find({idreceve :req.userData.userId}).sort({date : -1}).then( shares => {
        console.log('shares' + shares)
        const ids = []
        for (let i of shares) {
            console.log('one share ' + i.idpost)
             Bug.find({_id: i.idpost}).then(bugs => {

                User.find({_id: i.idshare}).then(user => {
                    obj = {
                        post: bugs,
                        user: user
                    }
                    ids.push(obj)
                })

            })
            console.log(ids)

        }
        res.status(200).json(shares)
    })
})
module.exports = route