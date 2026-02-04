// The purpose this file, is to verify authentication of users, before gaining access to pages which consist of confidential informations like profile, dashboard
import jwt from 'jsonwebtoken';

import { errorHandler } from './errorHandler.js';

export const verifyUser = (req, res, next)=>{
    //get the toke saved in the browser
    const token = req.cookies.access_token;

    if(!token){
        return next(errorHandler(401, 'Not authorized!'));
    }

    //verify user with jsonwebtoken
    //(err, userData) == returned error or returned user data
    //userData will be 'id' becasue when we used jwt to create a token we gave it an 'id' along with JWT_SECRET
    //like this: const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
    //result is like this: { id: '697e2bd742e243c425655d14', iat: 1770217229 }
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) =>{
        if(err){
            return next(errorHandler(401, 'Not authorized'));
        }

        if(userData){
            //add the data into request, so that other routes can acees it
            req.userData = userData;
        }

        next(); //go to next route/function
    })
} 
