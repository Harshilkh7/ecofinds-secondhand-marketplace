const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { prisma } = require('../db'); // ✅ correct import

// Checkout order
router.post('/', auth, async (req, res) => {
  // Get the user's cart with products
  console.log(req.user.id);
  
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } }
  });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart empty' });
  }

  // Map cart items to order items
  const orderItems = cart.items.map(i => ({
    productId: i.productId,
    title: i.product.title,
    price: i.product.price,
    qty: i.qty
  }));

  // Calculate total
  const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Create the order
  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      total,
      items: { create: orderItems }
    },
    include: { items: true }
  });

  // Clear cart items
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  res.status(201).json({ order });
});

module.exports = router;
