const mongoos = require('mongoose')



const readlaterModel= mongoos.Schema({
    idpost:{type :String, required : true},
    iduser:{type :String, required : true},
    date: { type: Date, default: Date.now },

})
module.exports= mongoos.model('ReadLater',readlaterModel)
// SmYRjZqNHSXHhcth



