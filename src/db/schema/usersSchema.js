"use strict"

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    emailAddress: {
        type: String
    },
    password: {
        type: String
    }
},{
    collection: "users",
    timestamp:{
        createdAt: 'CreatedDate',
        upadtedAt: 'updatedDate'
    }
})

const userModel = mongoose.model("users", userSchema);

module.exports = {
    userModel
}