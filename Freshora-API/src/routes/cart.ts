import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cartController';
import { authMiddleware } from '../middlewares/auth';
const r = Router();
r.get('/', authMiddleware, getCart);
r.post('/', authMiddleware, addToCart);
r.put('/:id', authMiddleware, updateCartItem);
r.delete('/:id', authMiddleware, removeCartItem);
export default r;
