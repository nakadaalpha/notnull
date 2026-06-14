const mysql = require('mysql2/promise');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  console.log('Connecting to MySQL (gt3)...');
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gt3'
  });

  console.log('Connected. Starting migration to PostgreSQL...');

  try {
    // 1. Migrate Brands
    console.log('Migrating Brands...');
    const [brands] = await connection.execute('SELECT * FROM brand');
    const brandMap = {}; // Maps old brand name to new PostgreSQL brand ID

    for (const b of brands) {
      // Create or find brand
      let newBrand = await prisma.brand.findUnique({ where: { name: b.car_brand } });
      if (!newBrand) {
        newBrand = await prisma.brand.create({
          data: { 
            name: b.car_brand,
            imageUrl: b.image || null
          }
        });
      }
      brandMap[b.brand_id] = newBrand.id;
    }
    console.log(`Migrated ${brands.length} brands.`);

    // 2. Migrate Cars
    console.log('Migrating Cars...');
    const [cars] = await connection.execute('SELECT * FROM car');
    const carMap = {}; // Maps old car_id (varchar) to new PostgreSQL car ID (int)

    for (const c of cars) {
      const newCar = await prisma.car.create({
        data: {
          model: c.car_name,
          yearMade: parseInt(c.year_made),
          price: parseFloat(c.price),
          stock: parseInt(c.stock) || 1,
          imageUrl: c.car_image || null,
          brandId: brandMap[c.car_brand] || 1 // Fallback to 1 if not found
        }
      });
      carMap[c.car_id] = newCar.id;
    }
    console.log(`Migrated ${cars.length} cars.`);

    // 3. Migrate Customers into Users
    console.log('Migrating Customers to Users...');
    const [customers] = await connection.execute('SELECT * FROM customer');
    const customerMap = {}; // Maps old customer_id to new PostgreSQL User ID

    for (const cus of customers) {
      const newCus = await prisma.user.create({
        data: {
          username: cus.customer_username,
          password: cus.customer_password || 'password123', // From legacy
          email: cus.customer_email || `${cus.customer_username}@example.com`,
          phone: cus.customer_phonenumb || null,
          address: cus.customer_address || null,
          role: 'CUSTOMER'
        }
      });
      customerMap[cus.customer_id] = newCus.id;
    }
    console.log(`Migrated ${customers.length} customers to Users.`);

    // 4. Migrate Transactions
    console.log('Migrating Transactions...');
    const [transactions] = await connection.execute('SELECT * FROM transaction');

    for (const t of transactions) {
      let tStatus = 'COMPLETED';
      if (t.status.toUpperCase() === 'PENDING') tStatus = 'PENDING';

      // Check if mapped car and customer exist
      if (customerMap[t.customer_id] && carMap[t.car_id]) {
        await prisma.transaction.create({
          data: {
            customerId: customerMap[t.customer_id],
            carId: carMap[t.car_id],
            amount: parseInt(t.amount) || 1,
            totalPrice: parseFloat(t.total_price),
            status: tStatus,
            createdAt: new Date(t.transaction_date) // Map legacy date to createdAt
          }
        });
      }
    }
    console.log(`Migrated ${transactions.length} transactions.`);

    console.log('--- MIGRATION COMPLETED SUCCESSFULLY ---');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
    await prisma.$disconnect();
  }
}

migrate();
