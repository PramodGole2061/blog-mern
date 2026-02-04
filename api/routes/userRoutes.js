import express from 'express';

// using {} to import is allowed only for named exports which looks like this: export const testApi = ()=>{}
import {testApi} from '../controllers/userController.js';
import {updateUser} from '../controllers/userController.js'
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

//for testing
router.get('/test', testApi)

//for updating user profile
router.put('/update/:userId', verifyUser, updateUser)

export default router;