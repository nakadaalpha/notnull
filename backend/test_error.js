const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const customers = await prisma.user.findMany({
      where: { role: { in: ['CUSTOMER', 'SALES'] } },
      include: {
        _count: {
          select: { transactions: true, reservationsAsCust: true }
        }
      }
    });
    console.log('Success:', customers.length);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main().finally(() => prisma.$disconnect());
