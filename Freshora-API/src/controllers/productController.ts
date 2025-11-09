import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export async function listProducts(req: Request, res: Response) {
  const { q, category, limit = 20, page = 1 } = req.query;
  const where: any = {};
  if (q) where.OR = [{ name: { contains: String(q), mode: 'insensitive' }}, { description: { contains: String(q), mode: 'insensitive' }}];
  if (category) where.category = { name: String(category) };
  const products = await prisma.product.findMany({
    where,
    include: { category: true, reviews: true },
    skip: (Number(page) -1) * Number(limit),
    take: Number(limit)
  });
  res.json({ products });
}

export async function getProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true, reviews: { include: { user: true } } }});
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
}

export async function createProduct(req: any, res: Response) {
  const { name, description, price, stock, categoryId, image } = req.body;
  const product = await prisma.product.create({
    data: { name, description, price: Number(price), stock: Number(stock), categoryId: Number(categoryId), image }
  });
  res.json({ product });
}

export async function updateProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, description, price, stock, categoryId, image } = req.body;
  const product = await prisma.product.update({
    where: { id },
    data: { name, description, price: Number(price), stock: Number(stock), categoryId: Number(categoryId), image }
  });
  res.json({ product });
}

export async function deleteProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.product.delete({ where: { id }});
  res.json({ ok: true });
}
