const mongoose = require("mongoose");
const userRoutes=require("./Modules/Routes/User");
const postRoutes=require("./Modules/Routes/post");
const likeRoutes = require('./Modules/Routes/like')
const commentRoutes = require('./Modules/Routes/comment')
const jobtRoutes = require('./Modules/Routes/job')
const bugRoutes = require('./Modules/Routes/bug')
// const googleUserRoutes=require("./Modules/Routes/googleUser");
const bodyParser=require("body-parser");
const path = require('path')
const express=require("express");
const googleUser=require("./Modules/Models/googleUser");
const app=express();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const passport =require("passport");
const  Connection  = require('./config/DBConnection.js');

Connection();
app.use('/images',express.static(path.join('images')))
app.use('/postImages',express.static(path.join('postImages')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//----------------------------setHeaders------------------------------------------------
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin , X-Requested-With , Content-Type , Accept,authorization");//authorization to store the token
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS");
    next();
})

//-----------------------------userRoute----------------
app.use("/api/user",userRoutes);
app.use("/api/bug",bugRoutes);
app.use("/api/post",postRoutes);
app.use("/api/like",likeRoutes);
app.use("/api/comment",commentRoutes);
app.use("/api/job",jobtRoutes);
// app.use("/api/googleuser",googleUserRoutes);

app.get("/",(req ,res)=>{
    res.send('you are connected')
    console.log("helo")})

//------------------------
module.exports=app;
