const mongoos = require('mongoose')



const likeModel= mongoos.Schema({
    idpost:{type :String, required : true},
    iduser:{type :String, required : true},
    categ:{type :String, required : true},
    date: { type: Date, default: Date.now },

})
module.exports= mongoos.model('Like',likeModel)