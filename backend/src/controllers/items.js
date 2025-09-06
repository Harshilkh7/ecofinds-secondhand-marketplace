const pool = require('../db'); // adjust path if needed

async function addItem(name, description, price) {
  try {
    const res = await pool.query(
      'INSERT INTO items (name, description, price) VALUES ($1, $2, $3) RETURNING *',
      [name, description, price]
    );
    console.log('Inserted item:', res.rows[0]);
  } catch (err) {
    console.error('Error inserting item:', err);
  }
}

// Example usage
addItem('Shirt', 'Blue cotton shirt', 250);
