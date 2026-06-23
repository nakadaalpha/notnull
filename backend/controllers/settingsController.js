const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get a setting by key
exports.getSetting = async (req, res) => {
  const { key } = req.params;
  try {
    const setting = await prisma.setting.findUnique({
      where: { key }
    });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching setting', error: error.message });
  }
};

// Update or create a setting by key
exports.upsertSetting = async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  if (!value) {
    return res.status(400).json({ message: 'Value is required' });
  }

  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Error updating setting', error: error.message });
  }
};
