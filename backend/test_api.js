const axios = require('axios');

async function main() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@notnull.com', // wait, do I know the admin email? Let me check users table.
      password: 'password123'
    });
    console.log(loginRes.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}
main();
