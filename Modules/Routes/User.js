require("dotenv").config();

const express=require("express");
const route=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../Models/User");
const Post=require("../Models/post");
const multer = require ('multer');
const checkauth = require('../../middlewares/check-auth')
//verification model
const userVerification=require("../Models/UserVerification")
//email handler
const nodemailer=require("nodemailer")
//unique string
const {v4:uuidv4}=require("uuid");

const path=require("path");

// multer stuff
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
        cb(error, 'images')
    },
    filename : (req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const ext = mime_type_map[file.mimetype]
        cb(null, name + '-' +Date.now() +'.'+ext)
    }
})


//node mailer stuff
 let transporter=nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:process.env.AUTH_EMAIL,
            pass:process.env.AUTH_PASS
    }
});
 transporter.verify((error,sucess)=>{
     if (error)
         console.log("error:"+error)
     else console.log("ready for message"+sucess);
 })

//-------------------------SIGNuP--------------------------------
route.post('/signUp',(req,res,next)=>{
    // console.log('function from sign up')
    bcrypt.hash(req.body.password,10).then(hash=>{
        const user=new User({
            email:req.body.email,
            password:hash,
            name:req.body.name,
            verified:false,
            isNew:true ,
            formatDate: req.body.formatDate
        }).save().then(result=>{
            console.log(result)
            sendVerificationEmail({_id:result._id+"",email:result.email},res);
        }).catch(error=>{
        console.log(error)
        {res.status(400).json({message:"oups we can't add user somthing went wrong!"})}})
    })
})

//--------------------------send verification mail method ---------------
const  sendVerificationEmail=({_id,email},res)=> {
    const cuurentUrl = "http://localhost:8000/";
    const uniqueString =  _id;//maybe worng na7i el faza eli 3malha hoia nta3 el uuid deja mat9al9ch blch biha
    const mailOptions = {
        form: process.env.AUTH_EMAIL,
        to: email,
        subject: "verify your email",
        html: `<p>verify your email to complete the signup and login into your account</p>
    <p>this link <b>expire in 6 hours</b></p><p>press<a href=${cuurentUrl + "api/user/verify/" + _id +"/"+ uniqueString}>here</a> to proceed</p>`
    }

    const salRounds = 10;
    bcrypt
        .hash(uniqueString, salRounds)
        .then((hashedString) => {
            const newVerification = new userVerification({
                userId: _id,
                uniqueString: hashedString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21000000
            })
                console.log(newVerification)
            newVerification
                .save()
                .then(() => {
                        transporter
                            .sendMail(mailOptions)
                            .then(() => {
                                res.json({
                                    status: "pending",
                                    message: "success email verification "
                                })

                            })
                            .catch(error => {
                                console.log(error)
                                res.json({
                                    status: "failed",
                                    message: "something went wrong while transport data "
                                })
                            })})
                            .catch(error => {
                                console.log(error)
                                res.json({
                                    status: "failed",
                                    message: "something went wrong while saving user verification "
                                })
                            })
                    }
                ).catch(error => {
                console.log(error)
                res.json({
                    status: "failed",
                    message: "something went wrong while hashing "
                })
            })
        ;
}

//--------------------------verify email-----------------

route.get("/verify/:userId/:uniqueString",(req,res)=>{
    let {userId,uniqueString}=req.params;

    userVerification.find({userId})
        .then((result)=>{
            if(result.length>0){
                console.log("res1:"+result[0])
                const {expiresAt}=result[0];
                const hashedUniqueString=result[0].uniqueString;
                if (expiresAt<Date.now()){
                    userVerification.deleteOne({userId})
                        .then(resulta=>{
                            User.deleteOne({_id:userId})
                                .then(()=>{
                                    let message= "user deleted please sign up again  ";
                                    res.redirect(`/api/user/verified?error=true&message=${message}`)
                                })
                                .catch(error=>{
                                console.log("error:can't delet user  "+error);
                                    let message= "clearing user with unique string failed ";
                                    res.redirect(`/api/user/verified?error=true&message=${message}`)
                            })
                        })
                        .catch((error)=>{
                            console.log(error);
                            let message= "An error occured while clearing expired user verification record ";
                            res.redirect(`/api/user/verified?error=true&message=${message}`)
                        })

                }else {
                    bcrypt.compare(uniqueString,hashedUniqueString)
                        .then((result)=>{
                            console.log("res2:"+result)
                            if (result){
                                User.updateOne({_id:userId},{verified:true})
                                    .then(()=>{
                                        console.log("updated3");
                                        res.sendFile(path.join(__dirname,"../views/verified.html"));
                                        //res.redirect(`/api/user/verified?id=${userId}`)
                                        console.log("is that her the fucking errror!");
                                    })
                                    .catch(error=>{
                                        let message= "an error occured while updating user to verified";
                                        res.redirect(`/api/user/verified?error=true&message=${message}`)
                                    })
                            }else{
                                let message= "invalid validation of unique string . check your inbox";
                                res.redirect(`/api/user/verified?error=true&message=${message}`)
                            }
                        })
                        .catch(error=>{
                            let message= "an error occured while comparing the unique string";
                            res.redirect(`/api/user/verified?error=true&message=${message}`)
                        })
                }
            }else {
                let message= "account doesn't exist or has been verified already";
                res.redirect(`/api/user/verified?error=true&message=${message}`)
            }
        })
        .catch(error=>{
            console.log(error)
            let message= "An error occured while checking for existing user";
            res.redirect(`/api/user/verified?error=true&message=${message}`)

        });
})


route.get("/verified",(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/verified.html"))// the file path of the code html that will shown to the user to verify her account using email
})


//-------------------------SIGNuP--------------------------------
/*route.post('/signUp',(req,res,next)=>{
    // console.log('function from sign up')
bcrypt.hash(req.body.password,10).then(hash=>{
    const user=new User({
        email:req.body.email,
        password:hash,
        name:req.body.name
    });
    user.save().then(result=>{
        res.status(201).json({message:"user added succesfuly",result:result})
    }).catch(error=>{res.status(400).json({message:"oups we can't add user somthing went wrong!"})})
})
})*/
//---------------------------Login---------------------------------
route.post("/login",(req,res,next)=>{
let fetchedUser;
User.findOne({email:req.body.email}).then(user=>{
    console.log(user);
    console.log('hello from login ')
    fetchedUser=user;
    if (!user || !user.verified){
        res.status(404).json({message:"user not found"});
    }
    return bcrypt.compare(req.body.password,fetchedUser.password)
}).then(result=>{
    console.log(result)
    if(!result){
        res.status(404).json({message:"faild to connect here!"})
    }
    const token=jwt.sign({email:fetchedUser.email,userId:fetchedUser._id},
                          "secret_this_should_be_longer",
                             {expiresIn: "9h"}
        );
    console.log(token)
    res.status(201).json({message:"connected !",token:token, id : fetchedUser._id  ,name: fetchedUser.name,isNew:fetchedUser.isNew});
}).catch(error=>{
    console.log(error);
    res.status(400).json({message:"somthing went wrong!"})
})
})

//--------------------------------------------------------
route.put("/updated",checkauth,(req,res,next)=>{
    const id= req.userData.userId ;
    User.updateOne({_id:id},{$set:{isNew:false}}).then(result=>{
        console.log("status aupdated successfuly")})
})
route.put("/upgradeprofile" ,checkauth,(req ,res)=>{
    const id = req.userData.userId;

    User.updateOne(
        { _id : id },
        {
            $set: { firstname:req.body.firstName,
                    lastName :req.body.lastName,
                    name :req.body.name,
                    birth :req.body.birth,
                    phone :req.body.phone,
                    proPhone:req.body.proPhone,
                    location:req.body.location,
                    facebook:req.body.facebook,
                    twitter:req.body.twitter,
                    github:req.body.github,
                    linkedin:req.body.linkedin,
                    bio :req.body.bio,
            },
            $currentDate: { lastModified: true }
        }
    ).then(res=>{
        console.log('updated')

    },err=>{
        console.log(err)
    })


})

route.put("/savelangage",checkauth,(req,res,next)=>{
    const id = req.userData.userId;
    const lan = req.body.langage
    // console.log('sl,dnjsdbn' +lan)
    // console.log(id)
    User.updateOne({_id:id},{$set:{langage : lan}}).then(result=>{
        console.log("res"+result)}).catch(err=>{
        console.log(err)
    })
})

route.get("",checkauth , (req ,res)=>{
    const id = req.userData.userId;
    User.findById(id).then(resul=>{
        console.log(resul)
        res.json(resul)
    }, err=>{
        console.log(err)
    })
})

route.put("/changephoto" ,checkauth,multer({storage : storage}).single('image'), (req ,res)=>{
    const url = req.protocol+'://'+req.get('host') ;
    console.log(url)
    const id = req.userData.userId;
    const imagepath = url + '/images/'+req.file.filename;
    console.log(imagepath)
    Post.updateMany({userId:id} ,{$set:{userimage : imagepath}}).then(_=>{
        console.log('picts updates')})
    User.updateOne({_id:id},{$set:{imagepath : imagepath}}).then(result=>{
        console.log("res"+result)}).catch(err=>{
        console.log('ici c l erreure'+err)
    })
})
route.get("/visitor/:id", (req,res)=>{
    const id = req.params.id
    User.findById(id).then(visitor=>{
        console.log('visitor'+visitor)
        res.status(200).json(visitor)
    },err=>{
        console.log(err)
    })
})
route.post("/followVisitor" ,checkauth,(req,res)=>{
    console.log(req.body.id)
    User.updateOne({_id :req.userData.userId }, {$push:{following :req.body.id}}).then(res=>{
        console.log('following upadated !')
    },err=>{
        console.log(err)
    })

})
route.post("/getfollowing" , checkauth ,(req ,res)=>{
    console.log(req.body.following)
    User.find({_id:{$in : req.body.following}}).then(following=>{
        res.status(200).json(following)
    },err=>{
        console.log(err)
    })
})

var states
var fb
var twitter
var linkedin
var github
route.use('/statistic',(req, res , next )=>{
    User.aggregate([
        {
            $group :{
                _id : "$formatDate",
                count:{$sum : 1}
            }

        }

    ]).sort({date : 1}).then(res=>{
        console.log(res)
        states=res


    })
    next()
})
route.use('/statistic',(req, res , next )=>{

    User.find({facebook: {$nin : ['null' ,'']}})
        .then(res=>{
            fb=res


        })

    next()
})

route.use('/statistic',(req, res , next )=>{

    User.find({twitter: {$nin : ['null', '']}})
        .then(res=>{
            twitter=res


        })
    next()
})
route.use('/statistic',(req, res , next )=>{

    User.find({github: {$nin : ['null', '']}})
        .then(res=>{
            github=res


        })
    next()
})

route.use('/statistic',(req, res , next )=>{

    User.find({linkedin: {$nin : ['null' ,'']}})
        .then(res=>{
            linkedin=res


        })
    next()
})

route.get("/statistic", (req,res)=>{
 res.status(200).json({
     states :states,
     fb:fb,
     twitter:twitter,
     linkedin: linkedin,
     github :github
 })
})


module.exports=route;
