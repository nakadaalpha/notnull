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
        mechanic: { select: { username: true } },
        transaction: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tradeIns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trade-ins' });
  }
};

// Get trade-ins for logged-in user
const getMyTradeIns = async (req, res) => {
  try {
    const tradeIns = await prisma.tradeIn.findMany({
      where: { customerId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tradeIns);
  } catch (error) {
    console.error('Availability Error:', error);
    res.status(500).json({ error: 'Failed to fetch your trade-ins' });
  }
};

const cancelUserTradeIn = async (req, res) => {
  const { id } = req.params;
  try {
    const tradeIn = await prisma.tradeIn.findUnique({ where: { id: parseInt(id) } });
    if (!tradeIn || tradeIn.customerId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const updated = await prisma.tradeIn.update({
      where: { id: parseInt(id) },
      data: { status: 'REJECTED' } // using REJECTED to denote cancelled
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel trade-in' });
  }
};

// Get availability for a specific date
const getAvailability = async (req, res) => {
  const { date } = req.query; // format: YYYY-MM-DD
  if (!date) return res.status(400).json({ error: 'Date is required' });

  try {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const bookedTradeIns = await prisma.tradeIn.findMany({
      where: {
        inspectionDate: { gte: startOfDay, lte: endOfDay },
        status: { notIn: ['REJECTED'] }
      },
      select: { inspectionDate: true }
    });

    const bookedReservations = await prisma.reservation.findMany({
      where: {
        inspectionDate: { gte: startOfDay, lte: endOfDay },
        status: { notIn: ['CANCELLED'] }
      },
      select: { inspectionDate: true }
    });

    const bookedHours = [];
    bookedTradeIns.forEach(t => {
      if (t.inspectionDate) bookedHours.push(t.inspectionDate.getUTCHours());
    });
    bookedReservations.forEach(r => {
      if (r.inspectionDate) bookedHours.push(r.inspectionDate.getUTCHours());
    });

    // Available slots: 9, 11, 13, 15
    const allSlots = [9, 11, 13, 15];
    const availableSlots = allSlots.map(hour => ({
      hour: hour,
      time: `${hour.toString().padStart(2, '0')}:00`,
      available: !bookedHours.includes(hour)
    }));

    res.json(availableSlots);
  } catch (error) {
    console.error('Availability Error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

const scheduleInspection = async (req, res) => {
  const { id } = req.params;
  const { inspectionDate } = req.body;

  try {
    const updatedTradeIn = await prisma.tradeIn.update({
      where: { id: parseInt(id) },
      data: {
        inspectionDate: new Date(inspectionDate),
        status: 'SCHEDULE_REQUESTED'
      }
    });
    res.json(updatedTradeIn);
  } catch (error) {
    console.error('Schedule Error:', error);
    res.status(500).json({ error: 'Failed to schedule inspection' });
  }
};

// Update status (Schedule Inspection, Appraise, Approve)
const updateTradeInStatus = async (req, res) => {
  const { id } = req.params;
  const { status, appraisedValue } = req.body;
  const userRole = req.user.role;

  try {
    // Basic RBAC checks
    if (status === 'INSPECTION_SCHEDULED' && !['ADMIN', 'MANAGER', 'SALES', 'MECHANIC'].includes(userRole)) {
      return res.status(403).json({ error: 'Not authorized to schedule inspections' });
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
    
    // Assign mechanic if changing from SCHEDULE_REQUESTED to INSPECTION_SCHEDULED and user is MECHANIC
    if (status === 'INSPECTION_SCHEDULED' && userRole === 'MECHANIC') {
      dataToUpdate.mechanicId = req.user.userId;
    }
    
    // Reset if cancelled
    if (status === 'TRADE_IN_PENDING') {
      dataToUpdate.inspectionDate = null;
      dataToUpdate.mechanicId = null;
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
  updateTradeInStatus,
  getAvailability,
  scheduleInspection,
  getMyTradeIns,
  cancelUserTradeIn
};
