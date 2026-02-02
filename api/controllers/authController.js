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
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(restOfCredentials)

    } catch (error) {
        next(error);
    }
}

//for google authentication
export const googleAuth = async (req, res, next) =>{
    const {name, email, googlePhotoUrl} = req.body;

    try{
        //check if user has signed up yet or not
        const user = await User.findOne({email});

        if(user){
            //since user has already signed up. Sign in the user

            //generate a token from their _id
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            
            //remove password in the response
            const {password, ...restOfCredentials} = user._doc;

            //send response back
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(restOfCredentials)

        }else{
            //since user is new, sign up the user

            //However we won't get a password from google authentication but password is set to required: true for sign up
            //thus we generate random random for the user for now, which can be changed later by the user
            //random() generates decimal number between 0 and 1. eg: 0.2542654245, .toString(36) allows numbers 0-9 and a-z alphabets to generate it instead and .slice(-8) starts from end to start and takes 8 characters from the generated random string(eg: 0.dg342435gsd6536)
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            //hash the password
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)

            const newUser = new User({
                name: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-3),
                email: email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            })

            const savedUser = await newUser.save();

            //generate token
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);

            //send response
            const {password, ...restOfCredentials} = savedUser._doc;
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(restOfCredentials)
        }
    }catch(error){
        next(error);
    }
}