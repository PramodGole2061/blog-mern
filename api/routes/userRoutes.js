import express from 'express';

// using {} to import is allowed only for named exports which looks like this: export const testApi = ()=>{}
import {testApi} from '../controllers/userController.js';

const router = express.Router();

router.get('/test', testApi)

export default router;