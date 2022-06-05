require("dotenv").config();
const express=require("express");
const route=express.Router();
const multer = require ('multer');
const checkauth = require('../../middlewares/check-auth')
const Post = require("../Models/post");
const readLater = require("../Models/readLater");
const Comment = require("../Models/comment");
const mime_type_map ={
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg'
}
const storage = multer.diskStorage({
    destination :(req , file, cb)=>{
        const  isvalid = mime_type_map[file.mimetype]
        let error = new Error("invalid mime type !") ;
        if(isvalid){
            error = null
        }
        cb(error, 'postImages')
    },
    filename : (req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const ext = mime_type_map[file.mimetype]
        cb(null, name + '-' +Date.now() +'.'+ext)
    }
})

route.post("/add" ,checkauth,multer({storage : storage}).single('image'), (req ,res)=>{
    const url = req.protocol+'://'+req.get('host') ;
    const imagepath = url + '/postImages/'+req.file.filename;
    const post=new Post({
        userId : req.userData.userId ,
        content : req.body.content ,
        fname : req.body.firstname,
        lname :req.body.lastname ,
        userimage:req.body.userimage,
        imagepath: imagepath,
        categori : req.body.categori,
    });

 post.save().then(post=>{
     console.log('post add successfuly')
     res.status(200).json(post);
 }, err=>{
     console.log('something went wrong' + err)
 })
})

route.get("" ,(req ,res)=>{
    Post.find().sort({date : -1}).then(posts=>{
        res.status(201).json(posts)
    },err=>{
        console.log('something went wrong '+ err)
    })
})

route.get("/userPosts" ,checkauth,(req ,res)=>{
    Post.find({userId : req.userData.userId}).sort({date : -1}).then(posts=>{
        res.status(201).json(posts)
    },err=>{
        console.log('something went wrong '+ err)
    })
})


route.post('/readlater',checkauth,(req,res,next)=>{
    const reaLater = new  readLater({
        idpost  : req.body.idpost,
        iduser  : req.userData.userId ,
    }).save().then((thisreadLater)=>{

            res.status(201).json({
                msg : 'rdc added successfuly !',
                reaadLaterf :{
                    id : thisreadLater._id,
                    ...thisreadLater,
                }
            })
        },
        (fail=>{
            console.log('this rdc cant be added !')
            console.log(fail)
        }))
})


route.delete('/deletereadlater/:id',checkauth,(req,res,next)=>{
        readLater.deleteOne({idpost : req.params.id  , iduser : req.userData.userId}).then(resultat=>{
            console.log(resultat)
            res.status(200).json({message :' a read later post deleted !'})
        })
    }
)

route.get('/getreadlater',checkauth,(req, res , next )=>{
    readLater.find({ 'iduser' :req.userData.userId}).then(message=>
        {
            if(message){

                res.status(200).json(message)
            }else{
                res.status(404).json('message : message not found!')
            }
        },
        err=>{
            console.log(err)
        })
})
route.post("/getPost" ,(req,res)=>{
    Post.findById(req.body.id).then(post=>{
        res.status(200).json(post)
    },err=>{
        console.log(err)
    })
})

route.post('/turnOffComments', checkauth,(req ,res)=>{

    Post.updateOne({_id: req.body.id},{$set:{comments:false}}).then(result=>{
        console.log("comments status aupdated successfuly")})
})
route.post('/turnOnComments', checkauth,(req ,res)=>{

    Post.updateOne({_id: req.body.id},{$set:{comments:true}}).then(result=>{
        console.log("comments status aupdated successfuly")})
})

route.post('/switchState', checkauth,(req ,res)=>{
     if(req.body.state){
         Post.updateOne({_id: req.body.id},{$set:{private:false}}).then(result=>{
             console.log("status aupdated successfuly")})
     }
     else{
         Post.updateOne({_id: req.body.id},{$set:{private:true}}).then(result=>{
             console.log("status aupdated successfuly")})
     }
})

route.post('/deletePost', checkauth,(req ,res)=>{

    Post.deleteOne({_id: req.body.id}).then(result=>{
        console.log("deleted successfuly")})
})
module.exports=route;