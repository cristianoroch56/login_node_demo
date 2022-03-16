"use strict"

const {
    userModel
} = require("../db/schema/usersSchema");
const ObjectId = require("mongoose").Types.ObjectId;

const userAuthorization = validateFn => async (req, res, next) => {

    let _user = null

    _user = await userModel.aggregate([{
        $match: {
            _id: ObjectId(req.user._id)
        }
    }]).exec((err, currentUser) => {

        if(err){
            console.log(err);
            return res.json({
                code: 0,
                error: "Errpr while getting data."
            })
        }

        currentUser = currentUser[0] ? currentUser[0] : []

        if(validateFn(currentUser,req)){
            req.user = currentUser;
            next();
        }else{
            res.json({
                error: "unauthorize"
            })
        }
    });


}

module.exports = {userAuthorization}