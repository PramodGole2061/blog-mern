import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";

//controller function for sign up route
export const signup = async (req, res, next) => {
    const {name, email, password} = req.body;

    if(!name.trim() || !email.trim() || !password.trim()){
        next(errorHandler(400, "All fields are required."));
        return;
    }

    //hashing the password
    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    try{
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });


        const savedUser = await newUser.save();

        res.status(200).json({message: "User registered successfully!", user: savedUser})
    }catch(err){
        console.error("Signup error at authController: ", err);
        next(err);
    }
}

//controller function fro sign in route
export const signin = async (req, res, next)=>{

    const {email, password} = req.body;

    if(!email.trim() || !password.trim()){
        return next(errorHandler(400, 'All fields need to be filled.'))
    }

    try {
        //check if user exists, it true get the user information
        const validUser = await User.findOne({email});

        if(!validUser){
            return next(errorHandler(404, 'User not found. Please signup first.'));
        }

        //compare the password
        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if(!validPassword){
            return next(errorHandler(401, 'Invalid credentials. Please try again.'));
        }

        //give a token to the valid user
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);

        //to remove password from the response
        const {password: pass, ...restOfCredentials} = validUser._doc;

        //It instructs the browser to save a cookie. { httpOnly: true } (The Security Part):This is a crucial security setting. It means the cookie cannot be accessed by client-side JavaScript (e.g., document.cookie will not show it).
        //.json(validUser) sends user data as a response to the client. which will be used in the client side to show user info
        res.status(200).cookie('access_token', token, {httpOnly: true}).json({restOfCredentials})

    } catch (error) {
        next(error);
    }
}
