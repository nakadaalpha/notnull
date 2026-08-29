
const prisma = require('./prismaClient');
async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  console.log('Admin:', admin);
}
main().finally(() => prisma.$disconnect());
