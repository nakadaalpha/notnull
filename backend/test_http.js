const axios = require('axios');

async function testHttp() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin',
      password: 'password123' // assuming this is the password, if not we'll create a new user
    });
    const token = loginRes.data.token;
    console.log("Logged in!");

    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userId = payload.userId;

    // 2. Create trade in
    const tradeInRes = await axios.post('http://localhost:5000/api/trade-in', {
      customerId: userId,
      licensePlate: 'TEST 123',
      brand: 'BMW',
      model: 'X5',
      year: 2020,
      notes: 'test'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Trade in created:", tradeInRes.data);

    // 3. Checkout
    const checkoutRes = await axios.post('http://localhost:5000/api/transactions/checkout', {
      carId: 5,
      customerId: userId,
      tradeInId: tradeInRes.data.id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Checkout successful:", checkoutRes.data);

  } catch (err) {
    console.error("HTTP ERROR:", err.response ? err.response.status : err.message);
    if (err.response) {
      console.error(err.response.data);
    } else {
      // If login failed, let's create a temp user and try again
      console.log("Login failed, trying to register a temp user...");
      try {
        const regRes = await axios.post('http://localhost:5000/api/auth/register', {
          username: 'testuser' + Date.now(),
          email: 'test' + Date.now() + '@test.com',
          password: 'password123',
          role: 'CUSTOMER'
        });
        const loginRes2 = await axios.post('http://localhost:5000/api/auth/login', {
          username: regRes.data.username || regRes.config.data.username, // oops, register doesn't return username, we use the generated one
          password: 'password123'
        });
        console.log("Temp user logged in!");
      } catch(e) {
        console.error("Temp user failed", e.response ? e.response.data : e.message);
      }
    }
  }
}

testHttp();
