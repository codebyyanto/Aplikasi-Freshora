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