import express = require('express'); // gunakan require-style
import { createOrder, listOrders, getOrder, updateOrderStatus } from '../controllers/orderController';
import { authMiddleware } from '../middlewares/auth';

const r = express.Router();

r.post('/', authMiddleware, createOrder);
r.get('/', authMiddleware, listOrders);
r.get('/:id', authMiddleware, getOrder);
r.put('/:id/status', authMiddleware, updateOrderStatus);

export default r;
