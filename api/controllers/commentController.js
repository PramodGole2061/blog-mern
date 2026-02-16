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

export const fetchComments = async (req, res, next)=>{
    try {
        const fetchedComments = await Comment.find({postId: req.params.postId}).sort({createdAt: -1});
         if(fetchedComments){
            res.status(200).json(fetchedComments);
         }else{
            next(errorHandler(500, 'Internal server error!'));
         }
    } catch (error) {
        next(errorHandler(400, 'Error fetching comments!'));
        console.error('Error fetching comments at fetchComments functiona at commentController.js: ', error);
    }
}

export const handleLike = async (req, res, next)=>{
    try {
        const comment = await Comment.findById({_id: req.params.commentId});
        if(!comment){
            return next(errorHandler(400, 'Comment does not exist!'));
        }else{
            // check if user's id is inside the arrray of likes
            const userIndex = comment.likes.indexOf(req.userData.id);
            //user's id is not inside the array of likes
            if(userIndex === -1){
                //increase numberOfLikes by 1
                comment.numberOfLikes += 1;
                //add user id to the array
                comment.likes.push(req.userData.id);
            }else{
                //decrease numberOfLikes by 1
                comment.numberOfLikes -= 1;
                //remove the user's id from the array
                comment.likes.splice(userIndex, 1);
            }

            //save the comment after changes 
            await comment.save();
            res.status(200).json(comment);
        }
    } catch (error) {
        next(errorHandler(400, 'Error saving like on a comment!'));
        console.error('Error saving like on a comment: ',error)
    }
}

export const handleEdit = async (req, res, next)=>{
    try {
        const comment = await Comment.findById({_id: req.params.commentId});
        if(!comment){
            return next(errorHandler(404, 'Comment not found!'));
        }else{
            if(comment.userId !== req.userData.userId && !req.userData.isAdmin){
                return next(errorHandler(403, 'You are not authorized to edit this comment!'))
            }

            const editedComment = await Comment.findByIdAndUpdate({_id: req.params.commentId}, {
                content: req.body.content
            }, {new: true})

            if(editedComment){
                res.status(200).json(editedComment);
            }else{
                next(errorHandler(500, 'Internal server error!'));
                console.error('Error returned from database while saving edited comment: ', editedComment.message);
            }
        }
    } catch (error) {
        next(errorHandler(400, 'Error saving the comment!'));
        console.error('Error saving an edited comment at handleEdit() at commentController.jsx: ', error)
    }
}