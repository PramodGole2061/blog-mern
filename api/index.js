import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import dbConnection from './config/dbConnection.js';

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
