import { Router } from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authMiddleware } from '../middlewares/auth';
const r = Router();
r.get('/', listCategories);
r.post('/', authMiddleware, createCategory);
r.put('/:id', authMiddleware, updateCategory);
r.delete('/:id', authMiddleware, deleteCategory);
export default r;
