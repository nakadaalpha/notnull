const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        customer: true,
        car: { include: { brand: true } }
      }
    });
    console.log('Success TX:', transactions.length);
  } catch (err) {
    console.error('Error TX:', err.message);
  }
}
main().finally(() => prisma.$disconnect());
