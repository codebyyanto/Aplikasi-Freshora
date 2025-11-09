import { Router } from 'express';
import { getProfile, addAddress, updateAddress, deleteAddress } from '../controllers/profileController';
import { authMiddleware } from '../middlewares/auth';
const r = Router();
r.get('/', authMiddleware, getProfile);
r.post('/address', authMiddleware, addAddress);
r.put('/address/:id', authMiddleware, updateAddress);
r.delete('/address/:id', authMiddleware, deleteAddress);
export default r;
