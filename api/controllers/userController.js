import validator from 'validator';
import bcrypt from 'bcryptjs';

import { errorHandler } from "../utils/errorHandler.js";
import User from '../models/userModel.js';

//this is named export function , it is better to use when there are multiple function to export
export const testApi = (req, res) => {
    res.json({message: "api is working"});
}

//for updating user
export const updateUser = async (req, res, next)=>{
    const userIdFromUrl = req.params.userId;
    const userIdFromToken = req.userData.id;

    if(!userIdFromToken === userIdFromUrl){
        return next(errorHandler(403, 'You are not authorized to update the user!'))
    }

    //check if email is in the request body and to be updated
    if(req.body.email){
        if(!validator.isEmail(req.body.email)){
            return next(errorHandler(400, 'Not an email!'))
        }
    }

    //check if password is to be updated
    if(req.body.password){
        if(!validator.isStrongPassword(req.body.password)){
            return next(errorHandler(400, "Not a strong password!"));
        }
    
        //encrypt password
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    //check if name is to be updated
    if(req.body.name){
        if(req.body.name.length > 20 || req.body.name.length < 3){
            return next(errorHandler(400, 'User name must be between 3 to 20.'));
        }

        if(!validator.isLowercase(req.body.name)){
            return next(errorHandler(400, 'User name must be lowercase.'))
        }

        if(req.body.name.includes(' ')){
            return next(errorHandler(400, 'User name can not include spaces.'))
        }

        if(!req.body.name.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, 'User name can only consist of letters and numbers.'))
        }
    }


    //Finally update
    try{
        //$set: {} instead of {name: req.body.name,...}
        //apparently it will check if these req.body.parameters are there or not and will include only if it is there
        //plus it seems to be more secure, becasue unauthorized users can't inject new queries like admin: true or something like that
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, {new: true} ) //new: true, will return updated user record otherwise it would return old user record

        const {password, ...restOfCredentials} = updatedUser._doc;
        res.status(200).json(restOfCredentials);
    }catch(err){
        next(err);
    }
}

