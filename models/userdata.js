const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = Schema({
    id:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    }
})

const imageSchema =  Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    testInvitation:{
        type: String,
        required: true
    },
    id:{
        type: String,
        required: true
    },
    images: [urlSchema]
})

module.exports = Image = mongoose.model('userdata', imageSchema);