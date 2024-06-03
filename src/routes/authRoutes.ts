import { Router } from 'express';
import { registerUser, loginUser, getUsers,getUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', authMiddleware, getUsers);


export default router;
