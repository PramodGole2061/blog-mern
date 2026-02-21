import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
//Parse Cookie header and populate req.cookies
import cookieParser from 'cookie-parser';
import path from 'path';

import dbConnection from './config/dbConnection.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'

//this will make dotenv.config() to be global on all files
dotenv.config();

const app = express();

//remove cors erors
app.use(cors());

//allow parsing of req.cookies
app.use(cookieParser());

//connect to db
dbConnection().then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("Server is running on port ", process.env.PORT);
    });
}).catch((error)=>{
    console.error("Failed to start server due to DB connection error", error);
})

const __dirname = path.resolve();

//routes
app.use(express.json());
//user routes
app.use('/api/user', userRoutes);
//auth routes
app.use('/api/auth', authRoutes);
//post routes
app.use('/api/post', postRoutes);
//comment routes
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

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