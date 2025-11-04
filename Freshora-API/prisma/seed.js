const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create sample user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@freshora.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@freshora.com',
      password: hashedPassword,
      phone: '+6234567890'
    }
  });

  // Create sample products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Fresh Peach',
        description: 'Sweet and juicy fresh peaches',
        price: 8.00,
        category: 'Fruits',
        unit: 'dozen',
        image: '#',
        rating: 4.5,
        reviewCount: 24
      },
      {
        name: 'Avocado',
        description: 'Creamy ripe avocados',
        price: 7.00,
        category: 'Fruits',
        unit: '2.0 lbs',
        image: '',
        rating: 4.3,
        reviewCount: 18
      },
      {
        name: 'Pineapple',
        description: 'Sweet tropical pineapple',
        price: 18.50,
        category: 'Fruits',
        unit: '1.50 lbs',
        image: '',
        rating: 4.7,
        reviewCount: 32
      },
      {
        name: 'Black Grapes',
        description: 'Seedless black grapes',
        price: 7.05,
        category: 'Fruits',
        unit: '5.0 lbs',
        image: '',
        rating: 4.4,
        reviewCount: 15
      },
      {
        name: 'Fresh Broccoli',
        description: 'Organic fresh broccoli',
        price: 2.22,
        category: 'Vegetables',
        unit: '1 kg',
        image: '',
        rating: 4.2,
        reviewCount: 28
      },
      {
        name: 'Organic Lemons',
        description: 'Fresh organic lemons from mountain farms',
        price: 2.22,
        category: 'Fruits',
        unit: '1.50 lbs',
        image: '',
        rating: 4.5,
        reviewCount: 89
      }
    ]
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });