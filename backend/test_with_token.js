const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const token = jwt.sign({ userId: '190626901984', role: 'ADMIN' }, JWT_SECRET, { expiresIn: '1d' });

async function main() {
  const custRes = await fetch('http://localhost:5000/api/customers', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Customers Status:', custRes.status);
  const custText = await custRes.text();
  console.log('Customers Response:', custText.substring(0, 200));

  const txRes = await fetch('http://localhost:5000/api/transactions', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Transactions Status:', txRes.status);
  const txText = await txRes.text();
  console.log('Transactions Response:', txText.substring(0, 200));
}
main();
