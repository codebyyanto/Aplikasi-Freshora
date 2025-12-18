import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Setup Categories
  const categoriesData = [
    { name: 'Vegetables' },
    { name: 'Buah' },
    { name: 'Minuman' },
    { name: 'Kebutuhan' },
    { name: 'Minyak nabati' }
  ];

  const categories: Record<string, number> = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name },
    });
    categories[cat.name] = record.id;
  }