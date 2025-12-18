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

    {
      name: "Pineapple",
      description: "Fresh Pineapple 1.50 lbs",
      price: 9.90,
      stock: 30,
      image: "pineapple.png",
      categoryName: "Buah"
    },
    {
      name: "Black Grapes",
      description: "Black Grapes 5.0 lbs",
      price: 7.05,
      stock: 25,
      image: "grapes.png",
      categoryName: "Buah"
    },

    {
      name: "Pomegranate",
      description: "Fresh Pomegranate 1.50 lbs",
      price: 2.09,
      stock: 45,
      image: "pomegranate.png",
      categoryName: "Buah"
    },
    {
      name: "Fresh Broccoli",
      description: "Fresh Broccoli 1 kg",
      price: 3.00,
      stock: 60,
      image: "broccoli.png",
      categoryName: "Vegetables"
    }
  ];

  for (const prod of productsData) {
    await prisma.product.create({
      data: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        image: prod.image,
        categoryId: categories[prod.categoryName]
      }
    });
  }