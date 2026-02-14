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
        if(validator.isEmpty(req.body.password)){
            return next(errorHandler(400, 'Password can not be empty!'));
        }
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

        const userExist = await User.findOne({name: req.body.name});
        if(userExist && userExist._id.toString() !== req.params.userId){
            return next(errorHandler(400, 'Username already exists!'));
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

export const deleteUser = async (req, res, next)=>{
    //if req.userData.isAdmin is true it doesn't go to next one and goes directly to try and catch
    //if req.userData.isAdmin is false it will check req.userData.id !== req.params.userId
    if(!req.userData.isAdmin && req.userData.id !== req.params.userId){
        return next(errorHandler(400, "Not authorized!"));
    }

    try {
        const deleteUser = await User.findByIdAndDelete(req.params.userId)

        if(!deleteUser){
            next(errorHandler(400, "User not found!"));
        }

        res.status(200).json('User deleted successfully!');

    } catch (error) {
        next(error)
    }
}

export const signoutUser = (req, res, next)=>{
    try {
        res.clearCookie('access_token').status(200).json('Signed out successfully!');
    } catch (error) {
        next(error)
    }
}

export const fetchUsers = async(req, res, next)=>{
    if(!req.userData.isAdmin){
        return next(errorHandler(403, 'You are not authorized!'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;

        const fetchedUsers = await User.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit);

        //remove the password from each user before sending response to frontend
        //since fetchedUsers will fetch users we need to loop for each user to remove password
        const usersWithoutPassword = fetchedUsers.map((user)=>{
            const {password, ...rest} = user._doc;
            return rest;
        })

        const numberOfUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        )

        const lastMonthUsers = await User.countDocuments({
            createdAt: {$gte: oneMonthAgo}
        })

        res.status(200).json({
            fetchedUsers: usersWithoutPassword,
            numberOfUsers: numberOfUsers,
            lastMonthUsers: lastMonthUsers
        })

    } catch (error) {
        next(errorHandler(400, 'Error fetching users!'));
        //next(error)
    }
}