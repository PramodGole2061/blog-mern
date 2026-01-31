import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';

import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";

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