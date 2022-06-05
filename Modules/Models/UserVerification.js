const mongosse=require("mongoose");
const UserVerificationSchema=mongosse.Schema({
   userId:String,
    uniqueString:String,
    createdAt:Date,
    expiresAt:Date
})
module.exports=mongosse.model("UserVerificationSchema",UserVerificationSchema);