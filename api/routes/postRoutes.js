import express from 'express';
import { create, fetch, deletePost } from '../controllers/postController.js';

import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

//to create new posts
router.post('/create', verifyUser, create)

//to fetch posts
router.get('/fetch', fetch)

//to delete posts
router.delete('/delete/:postId/:userId', verifyUser, deletePost)

export default router;