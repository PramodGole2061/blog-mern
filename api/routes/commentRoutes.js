import express from 'express';

import {verifyUser} from '../utils/verifyUser.js'
import {createComment, fetchComments, handleLike, handleEdit, deleteComment} from '../controllers/commentController.js'

const router = express.Router();

//create comment
router.post('/create', verifyUser, createComment);

//fetch comments
router.get('/fetch/:postId', fetchComments)

//for likes functionality
router.put('/like/:commentId', verifyUser, handleLike)

//for edit functionality
router.put('/edit/:commentId', verifyUser, handleEdit)

// for deleting
router.delete('/delete/:commentId', verifyUser, deleteComment)

export default router;