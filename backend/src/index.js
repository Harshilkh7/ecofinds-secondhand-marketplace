// backend/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

// Example controller for add-item
const { addItem } = require('./controllers/items'); // make sure this file exists

const app = express();

// ---------------- Middleware ----------------
app.use(cors());           // allow all origins
app.use(express.json());   // parse JSON bodies
app.use(morgan('dev'));    // log requests

// ---------------- Test Route ----------------
app.get('/', (req, res) => res.json({ ok: true, service: 'EcoFinds API (Prisma)' }));

// ---------------- Custom Route ----------------
app.post('/add-item', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Validation
    if (!name || !description || price == undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Call controller
    const item = await addItem(name, description, price);

    res.status(201).json({
      message: 'Item added successfully!',
      item,
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------- Main Routes ----------------
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// ---------------- 404 Handler ----------------
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// ---------------- Error Handler ----------------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
