import { errorHandler } from "../utils/errorHandler.js"
import Post from '../models/postModel.js'

export const create = async (req, res, next)=>{
    //'isAdmin' was used along with 'id' to create 'token' and checked that token in verifyUser.js and add it into the req as userData
    if(!req.userData.isAdmin){
        return next(errorHandler(403, 'You are not authorized!'))
    }

    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'All fields must be filled!'))
    }

    //it is better to create a slug for seo
    //https://www.example.com/blog/how-to-make-a-website, the slug is how-to-make-a-website
    //split with space, join with '-' and replace any char that is not alphanumerical with '-'
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')

    const createdPost = new Post({
        ...req.body,
        slug,
        userId: req.userData.id
    })

    try {
        const savedPost = await createdPost.save();
        res.status(200).json(savedPost)
    } catch (error) {
        console.error("Error saving a post at postController.js", error)
        next(errorHandler(400, "Error saving post!"))   
    }
}