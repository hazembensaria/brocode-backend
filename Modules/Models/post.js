const mongosse=require("mongoose");
const UniqueValidator=require("mongoose-unique-validator");
const postSchema=mongosse.Schema({
    userId : String ,
    content : String ,
    fname :String,
    lname: String ,
    userimage:String,
    imagepath: String,
    categori : String ,
    comments :{ type: Boolean, default: true },
    date: { type: Date, default: Date.now },
    private :{ type:Boolean, default: false },

})
postSchema.plugin(UniqueValidator);
module.exports=mongosse.model("Post",postSchema);
