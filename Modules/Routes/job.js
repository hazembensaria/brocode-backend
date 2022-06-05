const express = require('express')
const route = express.Router()
const Job= require('../Models/job')
const Apply= require('../Models/apply')
const User= require('../Models/User')
const checkauth = require('../../middlewares/check-auth')
const Post = require("../Models/post");



route.post('/add',checkauth,(req,res)=>{
    const  comment = new Job({
        level:req.body.level,
        name :req.body.name,
        imagepath :req.body.imagepath,
        iduser : req.userData.userId,
        location:req.body.location,
        type:req.body.type,
        content :req.body.content,
        salary :req.body.salary,
        tech : req.body.tech
    }).save().then(job=>{
        res.status(200).json({cm :comment})
    },err=>{
        console.log(err)
    })
})
route.get("" ,(req ,res)=>{
    Job.find().sort({date : -1}).then(jobs=>{
        res.status(201).json(jobs)
    },err=>{
        console.log('something went wrong '+ err)
    })
})

route.get("/userJobs" ,checkauth,(req ,res)=>{
    Job.find({iduser :req.userData.userId}).sort({date : -1}).then(jobs=>{
        res.status(201).json(jobs)
    },err=>{
        console.log('something went wrong '+ err)
    })
})


route.post('/apply',checkauth,(req,res)=> {
        Job.updateOne({_id:req.body.idpost},{$inc :{applied :1}}).then(res=>{
            console.log('added 1 to job')
        })
    const apply = new Apply({
        idpost:req.body.idpost,
        iduser:req.userData.userId,
        idposter:req.body.iduser
    }).save().then(apply=>{
        console.log('apply added succefuly')
    }, err=>{
        console.log(err)
    })
})
route.post('/sugest',checkauth,(req,res)=> {
    Job.find({tech:{$in: req.body.lang}}).then(jobs=>{
        res.status(200).json(jobs)
    },err=>{
        console.log(err);
    })

    })
route.post('/showApplied',checkauth,(req,res)=> {
    Apply.find({idpost: req.body.idJob}).then(apply=>{
        console.log(apply)
        const ids= []
        for(let appli of apply){
            ids.push(appli.iduser)
        }
        console.log(ids)
        User.find({_id:{$in: ids}}).then(users=>{
            res.status(200).json(users)
        },err=>{
            console.log(err)
        })
    },err=>{
        console.log(err);
    })

})

route.post('/switchStatus',checkauth,(req,res)=> {
    if(req.body.status){
        Job.updateOne({_id: req.body.idJob},{$set:{full:false}}).then(result=>{
            console.log("comments status aupdated successfuly")})
    }else{
        Job.updateOne({_id: req.body.idJob},{$set:{full:true}}).then(result=>{
            console.log("comments status aupdated successfuly")})
    }


})
route.post('/deleteJob',checkauth,(req,res)=> {
    Job.deleteOne({_id: req.body.idJob}).then(result=>{
        console.log("deleted successfuly")})

})

module.exports = route