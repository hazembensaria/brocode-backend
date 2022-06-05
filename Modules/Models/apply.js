const mongoos = require('mongoose')



const applyModel= mongoos.Schema({
    idpost:{type :String, required : true},
    iduser:{type :String, required : true},
    idposter:{type :String, required : true},
    date: { type: Date, default: Date.now },

})
module.exports= mongoos.model('Apply',applyModel)
// SmYRjZqNHSXHhcth



