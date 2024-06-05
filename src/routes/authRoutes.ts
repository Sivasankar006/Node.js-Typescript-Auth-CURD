import { Router } from 'express';
import { registerUser, loginUser, getUsers, getUser, getUserId, updateUser, deleteUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', authMiddleware, getUsers);
router.get('/users/:id', authMiddleware, getUser);
router.get('/singleuser/:id', authMiddleware, getUserId);
router.put('/singleusers/:id', updateUser);
router.delete('/singleusers/:id', deleteUser);



export default router;
