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
      // Map status
      let newStatus = 'AVAILABLE';
      if (c.status.toUpperCase() === 'SOLD') newStatus = 'SOLD';
      if (c.status.toUpperCase() === 'RENTED') newStatus = 'RENTED';

      const newCar = await prisma.car.create({
        data: {
          model: c.car_name,
          yearMade: parseInt(c.year_made),
          price: parseFloat(c.price),
          status: newStatus,
          imageUrl: c.car_image || null,
          brandId: brandMap[c.car_brand] || 1 // Fallback to 1 if not found
        }
      });
      carMap[c.car_id] = newCar.id;
    }
    console.log(`Migrated ${cars.length} cars.`);

    // 3. Migrate Customers
    console.log('Migrating Customers...');
    const [customers] = await connection.execute('SELECT * FROM customer');
    const customerMap = {}; // Maps old customer_id to new PostgreSQL customer ID

    for (const cus of customers) {
      const newCus = await prisma.customer.create({
        data: {
          name: cus.customer_username,
          email: cus.customer_email || `${cus.customer_username}@example.com`,
          phone: cus.customer_phonenumb || null,
          address: cus.customer_address || null
        }
      });
      customerMap[cus.customer_id] = newCus.id;
    }
    console.log(`Migrated ${customers.length} customers.`);

    // 4. Migrate Transactions
    console.log('Migrating Transactions...');
    const [transactions] = await connection.execute('SELECT * FROM transaction');

    for (const t of transactions) {
      let tStatus = 'COMPLETED';
      if (t.status.toUpperCase() === 'PENDING') tStatus = 'PENDING';

      // Old db only has transaction_date and amount (days). Let's calculate endDate
      const startDate = new Date(t.transaction_date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(t.amount));

      // Check if mapped car and customer exist
      if (customerMap[t.customer_id] && carMap[t.car_id]) {
        await prisma.transaction.create({
          data: {
            customerId: customerMap[t.customer_id],
            carId: carMap[t.car_id],
            type: 'RENT',
            startDate: startDate,
            endDate: endDate,
            totalPrice: parseFloat(t.total_price),
            status: tStatus
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
