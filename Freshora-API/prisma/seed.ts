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