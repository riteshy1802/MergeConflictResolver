const mongoose = require('mongoose');

const mergeSessionsSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    filesInvolved:[{type:String}],
    unresolvedConflicts:[{type:String}],
    resolvedFiles:[{type:String}],
    startedAt:{type:Date,default:Date.now()},
    completedAt:Date,
},{timestamps:true});

module.exports = mongoose.model('MergeSessions',mergeSessionsSchema);