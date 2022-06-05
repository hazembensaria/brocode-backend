const mongosse=require("mongoose");
const UniqueValidator=require("mongoose-unique-validator");
const stream = require("stream");
const shareSchema=mongosse.Schema({
    imagepath:String,
    title :String,
    name :String,
    idpost : String ,
    idshare : String ,
    idreceve : String,
    date: { type: Date, default: Date.now },
})


shareSchema.plugin(UniqueValidator);
module.exports=mongosse.model("Share",shareSchema);
