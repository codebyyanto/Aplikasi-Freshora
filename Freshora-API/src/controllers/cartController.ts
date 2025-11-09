import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export async function getCart(req: any, res: Response) {
  const userId = req.user.id;
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });
  res.json({ items });
}

export async function addToCart(req: any, res: Response) {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;
  const existing = await prisma.cartItem.findFirst({ where: { userId, productId }});
  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + Number(quantity) }
    });
    return res.json({ item: updated });
  }
  const item = await prisma.cartItem.create({
    data: { userId, productId: Number(productId), quantity: Number(quantity) }
  });
  res.json({ item });
}

export async function updateCartItem(req: any, res: Response) {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const { quantity } = req.body;
  const item = await prisma.cartItem.findUnique({ where: { id }});
  if (!item || item.userId !== userId) return res.status(404).json({ message: 'Item tidak ditemukan' });
  const updated = await prisma.cartItem.update({ where: { id }, data: { quantity: Number(quantity) }});
  res.json({ item: updated });
}

export async function removeCartItem(req: any, res: Response) {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const item = await prisma.cartItem.findUnique({ where: { id }});
  if (!item || item.userId !== userId) return res.status(404).json({ message: 'Item tidak ditemukan' });
  await prisma.cartItem.delete({ where: { id }});
  res.json({ ok: true });
}
