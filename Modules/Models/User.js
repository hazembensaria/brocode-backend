const mongosse=require("mongoose");
const UniqueValidator=require("mongoose-unique-validator");
const userSchema=mongosse.Schema({
    firstname :String ,
    lastName :String ,
    email:{type:String ,require:true,unique:true},
    password:{type:String,require:true},
    name:{type:String,require:true},
    Status:{type:String,require:false},
    verified:Boolean,
    isNew:Boolean,
    langage : [],
    birth : String ,
    phone :String,
    proPhone : String ,
    location :  String ,
    facebook :  String ,
    twitter :  String ,
    github :  String ,
    linkedin :  String ,
    bio :String ,
    date: { type: Date, default: Date.now },
    imagepath: String,
    following :[],
    role :{ type: String, default: 'user' },
    formatDate: String

})
userSchema.plugin(UniqueValidator);
module.exports=mongosse.model("User",userSchema);