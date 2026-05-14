const bcrypt = require('bcrypt');
async function run() {
  console.log('starting');
  const hash = await bcrypt.hash('password123', 10);
  console.log('hashed:', hash);
  const result = await bcrypt.compare('wrongpassword', hash);
  console.log('compare:', result);
}
run().then(() => console.log('done')).catch(err => console.error(err));
