const mongosse=require("mongoose");
const UniqueValidator=require("mongoose-unique-validator");
const bugSchema=mongosse.Schema({
    userId : String ,
    userimg :String ,
    content : String ,
    name :String ,
    tags : [],
    title :String ,
    comments :{ type: Boolean, default: true },
    date: { type: Date, default: Date.now },
})


bugSchema.plugin(UniqueValidator);
module.exports=mongosse.model("Bug",bugSchema);
