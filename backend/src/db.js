const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const prisma = new PrismaClient();
const pool = new Pool({
  connectionString: 'postgresql://ecouser:secret@localhost:5432/ecofinds'
});

// Test the connection
pool.connect()
  .then(client => {
    console.log('Connected to PostgreSQL successfully!');
    client.release(); // release client back to the pool
  })
  .catch(err => console.error('Connection error', err));

module.exports = pool;
module.exports = prisma;
