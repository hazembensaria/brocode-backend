require("dotenv").config();

const express=require("express");
const route=express.Router();
// const jwt=require("jsonwebtoken");
const googleUser=require("../Models/googleUser");
const passport = require("passport");
const {Strategy: GoogleStrategy} = require("passport-google-oauth20");



route.get("/login",(req,res,next)=>{


    passport.use(new GoogleStrategy({
            clientID: '407808074449-nke60352h790bq9u5fckb4gig20t1dle.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: "http://localhost:8000/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            const googleid = profile._json.sub
            googleUser.findOne({googleId:googleid}).then(user=>{
                if(!user){



                    console.log('user daosnt exist!!!')
                    res.json({kk:'nexist pas  !!'})
                }else

                console.log('hazem ben saria is here')

            })


        }
    ));
    route.get('/auth/google',
        passport.authenticate('google', { scope: ['email','profile'] }));

    route.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.send(req.user);
        });

})

module.exports=route;