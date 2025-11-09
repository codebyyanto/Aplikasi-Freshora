import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export async function getProfile(req: any, res: Response) {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { addresses: true }});
  res.json({ user });
}

export async function addAddress(req: any, res: Response) {
  const userId = req.user.id;
  const { label, street, city, postal, lat, lng } = req.body;
  const addr = await prisma.address.create({ data: { userId, label, street, city, postal, lat: lat ? Number(lat) : undefined, lng: lng ? Number(lng) : undefined }});
  res.json({ address: addr });
}

export async function updateAddress(req: any, res: Response) {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const addr = await prisma.address.findUnique({ where: { id }});
  if (!addr || addr.userId !== userId) return res.status(404).json({ message: 'Address not found' });
  const { label, street, city, postal, lat, lng } = req.body;
  const updated = await prisma.address.update({ where: { id }, data: { label, street, city, postal, lat: lat ? Number(lat) : undefined, lng: lng ? Number(lng) : undefined }});
  res.json({ address: updated });
}

export async function deleteAddress(req: any, res: Response) {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const addr = await prisma.address.findUnique({ where: { id }});
  if (!addr || addr.userId !== userId) return res.status(404).json({ message: 'Address not found' });
  await prisma.address.delete({ where: { id }});
  res.json({ ok: true });
}
