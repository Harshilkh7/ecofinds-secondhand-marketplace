// src/controllers/items.js
const { prisma } = require('../db');

async function addItem(title, description, price) {
  try {
    const item = await prisma.product.create({
      data: {
        title,
        description,
        price,
        category: 'Misc', // or pass as param
        images: [],       // default empty array
      },
    });
    return item;
  } catch (err) {
    console.error('Error inserting item:', err);
    throw err;
  }
}

module.exports = { addItem };
