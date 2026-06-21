async function main() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nakadaalpha@gmail.com', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  
  if (!token) {
    console.log('Login failed:', loginData);
    return;
  }
  
  const custRes = await fetch('http://localhost:5000/api/customers', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Customers Status:', custRes.status);
  const custData = await custRes.json();
  console.log('Customers Error:', custData.error);
  
  const txRes = await fetch('http://localhost:5000/api/transactions', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Transactions Status:', txRes.status);
}
main();
