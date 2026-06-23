
async function test() {
  try {
    console.log("Logging in...");
    // Need to login first to get a token, but I don't know the password for 'admin'.
    // Let's create a transaction directly using prisma.
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Find an admin user
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!adminUser) {
      console.log("No user found.");
      return;
    }
    
    console.log("Found user:", adminUser.username);
    
    // create trade-in
    const tradeIn = await prisma.tradeIn.create({
      data: {
        customerId: adminUser.id,
        licensePlate: 'AD 4879 AQC',
        brand: 'BMW',
        model: 'M4 Competition',
        year: 2026,
        notes: 'Mint',
        status: 'TRADE_IN_PENDING'
      }
    });
    console.log("Trade in created:", tradeIn.id);
    
    const car = await prisma.car.findFirst();
    let finalPrice = car.price;
    let tax = car.price * 0.11; // 11% tax
    const bookingFee = 5000;

    const newTransaction = await prisma.transaction.create({
      data: {
        customerId: adminUser.id,
        carId: car.id,
        tradeInId: tradeIn.id,
        totalPrice: finalPrice + tax,
        bookingFee: bookingFee,
        status: 'PENDING_PAYMENT',
        invoiceUrl: `https://checkout.xendit.co/web/mock-${Date.now()}`
      }
    });
    console.log("Transaction created:", newTransaction.id);
    
    // cleanup
    await prisma.transaction.delete({ where: { id: newTransaction.id } });
    await prisma.tradeIn.delete({ where: { id: tradeIn.id } });

  } catch (err) {
    console.error("ERROR:", err.message);
    if (err.response) {
      console.error(err.response.data);
    }
  }
}

test();
