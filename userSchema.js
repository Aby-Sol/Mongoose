const express = require('express')
const mongoose = require('mongoose')

//Creating a user schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    age : Number,
    favoriteFoods:[String]

})
 
//Exporting the Schema
module.exports = mongoose.model('User', userSchema)

