const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  
  const users = mongoose.connection.collection('users');
  const allUsers = await users.find({}).toArray();
  console.log("Users:", allUsers.map(u => ({ email: u.email, role: u.role })));
  process.exit(0);
}

check();
