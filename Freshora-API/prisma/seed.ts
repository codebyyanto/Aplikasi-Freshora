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

  const productsData = [
    {
      name: "Fresh Peach",
      description: "Fresh Peach per dozen",
      price: 8.00,
      stock: 50,
      image: "peach.png",
      categoryName: "Buah"
    },
    {
      name: "Avacado",
      description: "Fresh Avocado 2.0 lbs",
      price: 7.00,
      stock: 40,
      image: "avocado.png",
      categoryName: "Vegetables"
    },