import express from 'express';
import { create, fetch } from '../controllers/postController.js';

import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

//to create new posts
router.post('/create', verifyUser, create)

//to fetch posts
router.get('/fetch', fetch)

export default router;