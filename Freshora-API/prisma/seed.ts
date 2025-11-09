import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash('password123', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@freshora.com',
      password: pass,
      phone: '081234567890',
      addresses: {
        create: [
          {
            label: 'Rumah',
            street: 'Jl. Demo No.1',
            city: 'Jakarta',
            postal: '12345'
          }
        ]
      }
    }
  });

  const vegCat = await prisma.category.create({ data: { name: 'Sayuran' }});
  const fruitCat = await prisma.category.create({ data: { name: 'Buah' }});

  await prisma.product.createMany({
    data: [
      { name: 'Tomat', description: 'Tomat segar', price: 10000, stock: 50, image: '', categoryId: vegCat.id },
      { name: 'Wortel', description: 'Wortel organik', price: 12000, stock: 40, image: '', categoryId: vegCat.id },
      { name: 'Apel', description: 'Apel merah', price: 20000, stock: 30, image: '', categoryId: fruitCat.id }
    ]
  });

  console.log('Seed selesai');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
