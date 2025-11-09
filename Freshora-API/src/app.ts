import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import profileRoutes from './routes/profile';
import reviewRoutes from './routes/reviews';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(cors());
app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => res.json({ ok: true, app: 'Freshora API' }));

app.use(errorHandler);

export default app;
