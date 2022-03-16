"use strict";

const {
    validationResult
} = require("express-validator");

const jwt = require("jsonwebtoken")
const {
    userModel
} = require("../db/schema/usersSchema")
const {
    // encryptPassword,
    checkPassword
} = require("../utiles/common");
const ObjectId = require("mongoose").Types.ObjectId;

exports.signIn = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        });
    }

    const {
        emailAddress,
        password
    } = req.body;

    let _user = await userModel.findOne({
        emailAddress: emailAddress
    })
    
    if (_user) {
        let isPssword = await checkPassword(password, _user.password)

        if (isPssword) {

            let _token = jwt.sign({
                _id: _user._id,
                emailAddress: _user.emailAddress
            }, process.env.JWT_SECRET, {
                expiresIn: "4h"
            })
            
            return res.cookie("access_token", _token, {
                httponly: true
            }).status(200).json({
                _token
            })
        } else {
            res.status(401).json({
                code: 0,
                error: "Invalid password, please try again."
            });
        }
    } else {
        res.status(401).json({
            code: 0,
            error: "Invalid access, please try again."
        });
    }
}

exports.check = async (req, res) => {
    try {
        if (req.cookies['access_token'] || req.headers['access_token']) {
            
            const token = req.cookies['access_token'] || req.headers['access_token'];
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    res.status(401).json({
                        code: 0,
                        message: err.name + ": Please login again!"
                    });
                } else if (decoded) {
                    console.log(decoded);
                    let _user = null;

                    _user = await userModel
                        .aggregate([{
                            $match: {
                                _id: ObjectId(decoded._id)
                            }
                        }]);

                    if (_user && _user[0]) {
                        _user = _user[0]

                        if (!res.headersSent) return res.status(200).json({
                            token
                        });
                    } else {
                        return res.status(401).json({
                            error: "User Not Found"
                        })
                    }
                }
            });

        } else {
            res.status(401).json({
                code: 0,
                error: "Please login again."
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: error.array()
        });
    }
}

exports.signout = async (req, res) => {
    try {
        res.clearCookie('access_token')

        res.status(200).json({
            code: 5,
            error: "Logout successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: error.array()
        });
    }
}
