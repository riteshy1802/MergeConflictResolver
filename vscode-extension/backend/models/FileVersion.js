const mongoose = require('mongoose');

const fileVersionSchema = new mongoose.Schema({
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        filePath:{type:String,required:true},
        repo:{type:String,required:true},
        branch:{type:String,required:true},
        beforeContent:{type:String,required:true},
        afterContent:{type:String,required:true},
        commitMessage:{type:String,required:true},
    },
    {timestamps:true}
);

module.exports = mongoose.model('FileVersion',fileVersionSchema);