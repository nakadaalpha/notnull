const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new Trade-In request
const createTradeIn = async (req, res) => {
  const { customerId, licensePlate, brand, model, year, notes } = req.body;

  try {
    const newTradeIn = await prisma.tradeIn.create({
      data: {
        customerId,
        licensePlate,
        brand,
        model,
        year: parseInt(year),
        notes,
        status: 'TRADE_IN_PENDING'
      }
    });
    res.status(201).json(newTradeIn);
  } catch (error) {
    console.error('Create TradeIn error:', error);
    res.status(500).json({ error: 'Failed to create trade-in request' });
  }
};

// Get all Trade-Ins (for Admin/Manager/Sales)
const getAllTradeIns = async (req, res) => {
  try {
    const tradeIns = await prisma.tradeIn.findMany({
      include: {
        customer: { select: { username: true, email: true, phone: true } },
        transaction: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tradeIns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trade-ins' });
  }
};

// Update status (Schedule Inspection, Appraise, Approve)
const updateTradeInStatus = async (req, res) => {
  const { id } = req.params;
  const { status, appraisedValue } = req.body;
  const userRole = req.user.role;

  try {
    // Basic RBAC checks
    if (status === 'INSPECTION_SCHEDULED' && !['ADMIN', 'MANAGER', 'SALES'].includes(userRole)) {
      return res.status(403).json({ error: 'Only Sales/Manager/Admin can schedule inspections' });
    }
    if (status === 'WAITING_APPROVAL' && !['ADMIN', 'MANAGER', 'MECHANIC'].includes(userRole)) {
      return res.status(403).json({ error: 'Only Mechanics/Manager/Admin can submit appraisals' });
    }
    if (status === 'APPROVED' && !['ADMIN', 'MANAGER'].includes(userRole)) {
      return res.status(403).json({ error: 'Only Managers/Admin can approve trade-ins' });
    }

    const dataToUpdate = { status };
    if (appraisedValue !== undefined) {
      dataToUpdate.appraisedValue = parseFloat(appraisedValue);
    }

    const updatedTradeIn = await prisma.tradeIn.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });
    res.json(updatedTradeIn);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trade-in' });
  }
};

module.exports = {
  createTradeIn,
  getAllTradeIns,
  updateTradeInStatus
};
