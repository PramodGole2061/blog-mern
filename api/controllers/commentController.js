import Comment from "../models/commentModel.js";
import { errorHandler } from "../utils/errorHandler.js"

export const createComment = async (req, res, next)=>{
    try {
        const {content, postId, userId} = req.body;

        if(userId !== req.userData.id){
            return next(errorHandler(403, 'You are not authorized to create this comment!'));
        }

        const newComment = new Comment({content, postId, userId});
        const savedComment = await newComment.save();

        if(savedComment){
            res.status(200).json(savedComment);
        }else{
            next(errorHandler(500, 'Internal server error!'));
        }

    } catch (error) {
        next(errorHandler(400, 'Could not save the comment!'));
        console.error('Error saving a comment at createComment function in the CommentController.js :', error)
    }
}