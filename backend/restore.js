const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const generateId = require('./utils/generateId');

const prisma = new PrismaClient();

async function restore() {
  console.log('Starting restoration...');
  try {
    const dataRaw = fs.readFileSync('backup.json', 'utf8');
    const data = JSON.parse(dataRaw);

    // 1. Restore Brands
    console.log('Restoring Brands...');
    for (const b of data.brands) {
      await prisma.brand.create({ data: b });
    }

    // 2. Restore Cars
    console.log('Restoring Cars...');
    for (const c of data.cars) {
      await prisma.car.create({ data: c });
    }

    // 3. Restore Users
    console.log('Restoring Users...');
    const userMap = {}; // Maps old ID (Int) to new ID (String)
    for (const u of data.users) {
      const newId = generateId();
      userMap[u.id] = newId;
      
      const userData = { ...u, id: newId };
      await prisma.user.create({ data: userData });
    }

    // 4. Restore Transactions
    console.log('Restoring Transactions...');
    for (const t of data.transactions) {
      const newCustomerId = userMap[t.customerId];
      if (newCustomerId) {
        const txData = { ...t, customerId: newCustomerId };
        delete txData.id; // Let autoincrement handle it
        await prisma.transaction.create({ data: txData });
      }
    }

    // 5. Restore Reservations
    console.log('Restoring Reservations...');
    if (data.reservations) {
      for (const r of data.reservations) {
        const newCustomerId = userMap[r.customerId];
        const newSalesId = r.salesId ? userMap[r.salesId] : null;
        if (newCustomerId) {
          const resData = { ...r, customerId: newCustomerId, salesId: newSalesId };
          delete resData.id;
          await prisma.reservation.create({ data: resData });
        }
      }
    }

    // 6. Restore Messages
    console.log('Restoring Messages...');
    if (data.messages) {
      for (const m of data.messages) {
        const newSenderId = userMap[m.senderId];
        const newReceiverId = userMap[m.receiverId];
        if (newSenderId && newReceiverId) {
          const msgData = { ...m, senderId: newSenderId, receiverId: newReceiverId };
          delete msgData.id;
          await prisma.message.create({ data: msgData });
        }
      }
    }

    console.log('Restoration completed successfully!');
  } catch (err) {
    console.error('Restoration failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

restore();
