const express = require('express')
const router = express.Router()
const Like = require('../Models/like')
const checkauth = require('../../middlewares/check-auth')


router.delete('/:idd',checkauth,(req,res,next)=>{
        console.log(req.params.idd)
        Like.deleteOne({idpost : req.params.idd  , iduser : req.userData.userId}).then(resultat=>{
            console.log(resultat)
            res.status(200).json({message :'rdc deleted !'})
        })
    }

)
router.post('',checkauth,(req,res,next)=>{
    const like = new Like({
        idpost  : req.body.idpost,
        iduser  : req.userData.userId ,
        categ :req.body.categ

    }).save().then(thislike=>{
            console.log(thislike)
            console.log(like)
            res.status(201).json({
                msg : 'rdc added successfuly !',
                likef :{
                    id : thislike._id,
                    ...thislike,
                }
            })
        },
        (fail=>{
            console.log('this like cant be added !')
            console.log(fail)
        }))
})


router.get('/userlikedposts',checkauth,(req, res , next )=>{
    const id = req.userData.userId;
    Like.find({ 'iduser' :id}).then(message=>
        {
            if(message){

                console.log(message)
                res.status(200).json(message)
            }else{
                res.status(404).json('message : message not found!')
            }
        },
        err=>{
            console.log(err)
        })
})
var likes
router.use('',(req, res , next )=>{



    Like.aggregate([
        {
            $group :{
                _id : "$categ",
                count:{$sum : 1}
            }
        }
    ]).then(product=>{
        likes =product
        console.log(likes)
    })

    next()
})

router.use('',(req, res , next )=>{

    Like.aggregate([
        {
            $group :{
                _id : "$idpost",
                count:{$sum : 1}
            }
        }
    ]).then(product=>
        {

            res.status(200).json({
                product:product,
                likes :likes,
            })
        }

        ,
        err=>{
            console.log(err)
        })
})



module.exports = router
