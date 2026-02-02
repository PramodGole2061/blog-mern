import express from 'express';

import { signup, signin, googleAuth } from '../controllers/authController.js';

const router = express.Router();

//for sign up
router.post('/signup', signup)

//for sign in
router.post('/signin', signin)

//for google authentication
router.post('/google', googleAuth)

export default router;