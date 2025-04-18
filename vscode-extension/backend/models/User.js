const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
        githubId:{type:String,required:true,unique:true},
        name:{type:String,required:true},
        email:{type:String,required:true},
        avatarURL:{type:String,required:true},
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model('User',userSchema);