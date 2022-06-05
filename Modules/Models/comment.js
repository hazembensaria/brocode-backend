const mongoos = require('mongoose')



const commentModel= mongoos.Schema({
    idcomment:{type :String, required : true},
    content :{type :String, required : true},
    iduser:{type :String, required : true},
    name:{type :String, required : true},
    imagepath:{type :String, required : true},
    date: { type: Date, default: Date.now },

})
module.exports= mongoos.model('Comment',commentModel)