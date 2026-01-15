import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export async function getProfile(req: any, res: Response) {
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: {
        orderBy: { isDefault: 'desc' } // Default address first
      }
    }
  });
  res.json({ user });
}

export async function addAddress(req: any, res: Response) {
  const userId = req.user.id;
  const { label, street, city, postal, lat, lng, recipientName, country, phoneNumber, isDefault } = req.body;

  // Handle default address logic
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  const addr = await prisma.address.create({
    data: {
      userId,
      label,
      street,
      city,
      postal,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      recipientName,
      country,
      phoneNumber,
      isDefault: isDefault || false
    }
  });
  res.json({ address: addr });
}

export async function updateAddress(req: any, res: Response) {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const addr = await prisma.address.findUnique({ where: { id } });
  if (!addr || addr.userId !== userId) return res.status(404).json({ message: 'Address not found' });

  const { label, street, city, postal, lat, lng, recipientName, country, phoneNumber, isDefault } = req.body;

  // Handle default address logic
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId, id: { not: id } },
      data: { isDefault: false }
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: {
      label,
      street,
      city,
      postal,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      recipientName,
      country,
      phoneNumber,
      isDefault
    }
  });
  res.json({ address: updated });
}

export async function deleteAddress(req: any, res: Response) {
  const userId = req.user.id;
  const id = Number(req.params.id);
  const addr = await prisma.address.findUnique({ where: { id } });
  if (!addr || addr.userId !== userId) return res.status(404).json({ message: 'Address not found' });
  await prisma.address.delete({ where: { id } });
  res.json({ ok: true });
}
