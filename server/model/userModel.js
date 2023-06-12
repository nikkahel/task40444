const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    email:{type:String, unique:false, required:true},
    password:{type:String, required:true},
    username:{type:String, unique:true, required:true},
    date:{type:String,required:true},
    lastLogin:{type:String,required:true},
    status:{type:String, required:true}
})
module.exports = model('User',UserSchema)