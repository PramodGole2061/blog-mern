import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import dbConnection from './config/dbConnection.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js'
import { error } from 'console';

//this will make dotenv.config() to be global on all files
dotenv.config();

const app = express();

//connect to db
dbConnection().then(()=>{
    app.listen(3000, ()=>{
        console.log("Server is running on port 3000");
    });
}).catch((error)=>{
    console.error("Failed to start server due to DB connection error", error);
})

//routes
app.use(express.json());
//user routes
app.use('/api/user', userRoutes);
//auth routes
app.use('/api/auth', authRoutes)

//middleware for handling errors
app.use((error, req, res, next) =>{
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})