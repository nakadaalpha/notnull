const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function backup() {
  console.log('Starting backup...');
  try {
    const brands = await prisma.brand.findMany();
    const cars = await prisma.car.findMany();
    const users = await prisma.user.findMany();
    const transactions = await prisma.transaction.findMany();
    const reservations = await prisma.reservation.findMany();
    const messages = await prisma.message.findMany();

    const data = {
      brands,
      cars,
      users,
      transactions,
      reservations,
      messages
    };

    fs.writeFileSync('backup.json', JSON.stringify(data, null, 2));
    console.log('Backup successful to backup.json');
  } catch (err) {
    console.error('Backup failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

backup();
