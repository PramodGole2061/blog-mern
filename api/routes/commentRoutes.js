import express from 'express';

import {verifyUser} from '../utils/verifyUser.js'
import {createComment, fetchComments, handleLike} from '../controllers/commentController.js'

const router = express.Router();

//create comment
router.post('/create', verifyUser, createComment);

//fetch comments
router.get('/fetch/:postId', fetchComments)

//for likes functionality
router.put('/like/:commentId', verifyUser, handleLike)

export default router;