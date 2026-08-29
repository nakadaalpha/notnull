const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Supabase database with luxury vehicles...');

  // Create Brands
  const porsche = await prisma.brand.upsert({
    where: { name: 'Porsche' },
    update: {},
    create: { name: 'Porsche', imageUrl: '/images/brands/porsche.png' }
  });

  const bmw = await prisma.brand.upsert({
    where: { name: 'BMW' },
    update: {},
    create: { name: 'BMW', imageUrl: '/images/brands/bmw.png' }
  });

  const mercedes = await prisma.brand.upsert({
    where: { name: 'Mercedes-Benz' },
    update: {},
    create: { name: 'Mercedes-Benz', imageUrl: '/images/brands/mercedes.png' }
  });

  // Create Cars
  await prisma.car.createMany({
    data: [
      {
        brandId: porsche.id,
        model: '911 GT3 RS',
        yearMade: 2024,
        price: 3500000000,
        stock: 2,
        imageUrl: '/images/cars/gt3rs.png',
        specifications: { engine: '4.0L Flat-6', power: '518 hp', transmission: '7-speed PDK' }
      },
      {
        brandId: bmw.id,
        model: 'M4 Competition',
        yearMade: 2023,
        price: 2100000000,
        stock: 3,
        imageUrl: '/images/cars/m4.png',
        specifications: { engine: '3.0L Twin-Turbo I6', power: '503 hp', transmission: '8-speed Automatic' }
      },
      {
        brandId: mercedes.id,
        model: 'AMG G63',
        yearMade: 2024,
        price: 4200000000,
        stock: 1,
        imageUrl: '/images/cars/g63.png',
        specifications: { engine: '4.0L V8 Biturbo', power: '577 hp', transmission: '9-speed Automatic' }
      }
    ],
    skipDuplicates: true
  });

  // Create an Admin user for them to login
  const bcrypt = require('bcryptjs');
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@notnull.com' },
    update: {},
    create: {
      id: 'admin_001',
      username: 'admin',
      email: 'admin@notnull.com',
      password: hashedAdminPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ Seeding completed! Luxury collection is now live.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
