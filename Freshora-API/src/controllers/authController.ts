import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';

export async function register(req: Request, res: Response) {
  const { name, email, password, phone } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email & password required' });
  const exists = await prisma.user.findUnique({ where: { email }});
  if (exists) return res.status(400).json({ message: 'Email sudah terdaftar' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashed, phone }});
  const token = signToken({ id: user.id, email: user.email });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken({ id: user.id, email: user.email });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
}

export async function me(req: any, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { addresses: true }});
  res.json({ user });
}