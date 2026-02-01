import express from 'express';

import { signup, signin } from '../controllers/authController.js';

const router = express.Router();

//for sign up
router.post('/signup', signup)

//for sign in
router.post('/signin', signin)

export default router;