import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import dbConnection from './config/dbConnection.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js'
import { error } from 'console';

//this will make dotenv.config() to be global on all files
dotenv.config();

const app = express();

//remove cors erors
app.use(cors());

//connect to db
dbConnection().then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("Server is running on port ", process.env.PORT);
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