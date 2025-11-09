import { Router } from 'express';
import { listReviews, createReview } from '../controllers/reviewController';
import { authMiddleware } from '../middlewares/auth';
const r = Router();
r.get('/', listReviews);
r.post('/', authMiddleware, createReview);
export default r;
