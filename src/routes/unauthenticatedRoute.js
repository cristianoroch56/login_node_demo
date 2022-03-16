"use strict";

const {
    checkSchema
} = require("express-validator");

const auth = require("express").Router();
const unauthenticatedController = require("../controlles/unauthenticatedController");

auth.post("/signin", checkSchema({
    
    emailAddress:{
        isEmail: true
    },
    password:{
        isString: true,
        isLength: {
                errorMessage: "Password should be at least 6 chars long",
                options: {
                  min: 6
                }
              }
    }
}), unauthenticatedController.signIn);

auth.post("/check", unauthenticatedController.check);

auth.post("/signout", unauthenticatedController.signout);

module.exports = auth