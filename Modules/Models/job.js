
const mongoos = require('mongoose')



const jobModel= mongoos.Schema({
    level:{type :String, required : true},
    iduser :{type :String, required : true},
    name:{type :String, required : true},
    imagepath:{type :String, required : true},
    location:{type :String, required : true},
    type:{type :String, required : true},
    content :{type :String, required : true},
    salary :{type :String, required : true},
    date: { type: Date, default: Date.now },
    tech :[],
    applied: { type: Number, default: 0 },
    full: { type: Boolean, default: false },

})
module.exports= mongoos.model('Job',jobModel)
