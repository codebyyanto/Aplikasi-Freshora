import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export async function listReviews(req: Request, res: Response) {
  const { productId } = req.query;
  const where: any = {};
  if (productId) where.productId = Number(productId);
  const reviews = await prisma.review.findMany({ where, include: { user: true } });
  res.json({ reviews });
}

export async function createReview(req: any, res: Response) {
  const userId = req.user.id;
  const { productId, rating, comment } = req.body;
  const review = await prisma.review.create({ data: { userId, productId: Number(productId), rating: Number(rating), comment }});
  res.json({ review });
}
