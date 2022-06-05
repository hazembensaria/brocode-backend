const mongosse=require("mongoose");
const UniqueValidator=require("mongoose-unique-validator");
const googleUserSchema=mongosse.Schema({
    email:{type:String ,require:true,unique:true},
    googleId:{type:String ,require:true,unique: true},
    name:{type:String,require:true},
    verified:Boolean,
    isNew:Boolean
})
googleUserSchema.plugin(UniqueValidator);
module.exports=mongosse.model("googleUser",googleUserSchema);