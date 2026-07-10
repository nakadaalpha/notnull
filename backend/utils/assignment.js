/**
 * Utility to assign a new lead (Transaction or Reservation) to a Sales representative
 * using a Smart Round-Robin (Load Balancing) approach.
 */
const assignToSalesRep = async (prisma) => {
  try {
    // 1. Fetch all users with role 'SALES'
    const salesReps = await prisma.user.findMany({
      where: { role: 'SALES' },
      select: { id: true, username: true }
    });

    if (!salesReps || salesReps.length === 0) {
      return null; // No sales reps available in the system
    }

    // 2. Fetch active workloads (Pending/Awaiting Payment) for each sales rep
    let minLoad = Infinity;
    let selectedSalesId = salesReps[0].id; // Default to first

    for (const rep of salesReps) {
      const activeTransactions = await prisma.transaction.count({
        where: {
          salesId: rep.id,
          status: { in: ['PENDING', 'AWAITING_PAYMENT'] }
        }
      });

      const activeReservations = await prisma.reservation.count({
        where: {
          salesId: rep.id,
          status: { in: ['PENDING', 'CONFIRMED'] }
        }
      });

      const currentLoad = activeTransactions + activeReservations;

      // Select the one with the lowest current workload
      if (currentLoad < minLoad) {
        minLoad = currentLoad;
        selectedSalesId = rep.id;
      }
    }

    return selectedSalesId;
  } catch (error) {
    console.error('Error in assignToSalesRep:', error);
    return null; // Fallback to unassigned on error
  }
};

module.exports = { assignToSalesRep };
