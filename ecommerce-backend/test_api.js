const email = "jeswarathlete@gmail.com";
const name = "Jeswar A M";
const role = "user";
const password = "nopassword";
const API_URL = "http://localhost:5001";

async function test() {
  console.log("Attempting Login...");
  let res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  console.log("Login Status:", res.status);
  let text = await res.text();
  console.log("Login Body:", text);

  if (!res.ok) {
    console.log("Attempting Register...");
    res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    console.log("Register Status:", res.status);
    text = await res.text();
    console.log("Register Body:", text);
  }
}

test();
