import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'Tidak ada token' });
    const token = auth.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'secret';
    const payload: any = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
}