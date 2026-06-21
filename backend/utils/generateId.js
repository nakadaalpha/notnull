function generateId() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  
  // Generate 6 random digits
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  
  return `${day}${month}${year}${randomPart}`;
}

module.exports = generateId;
