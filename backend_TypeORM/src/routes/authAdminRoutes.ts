import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/AuthAdminController';
import { verifyJWT } from '../middleware/verifyJWT';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current', verifyJWT, getCurrentUser);

export default router;
