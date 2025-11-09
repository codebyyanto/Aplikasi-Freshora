import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export async function listCategories(req: Request, res: Response) {
  const categories = await prisma.category.findMany({ include: { products: true }});
  res.json({ categories });
}

export async function createCategory(req: Request, res: Response) {
  const { name } = req.body;
  const cat = await prisma.category.create({ data: { name }});
  res.json({ category: cat });
}

export async function updateCategory(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name } = req.body;
  const cat = await prisma.category.update({ where: { id }, data: { name }});
  res.json({ category: cat });
}

export async function deleteCategory(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.category.delete({ where: { id }});
  res.json({ ok: true });
}
