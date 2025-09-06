const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const prisma = require('../db');

// Checkout order
router.post('/', auth, asyncHandler(async (req, res) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } }
  });
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart empty' });

  const orderItems = cart.items.map(i => ({
    productId: i.productId,
    title: i.product.title,
    price: i.product.price,
    qty: i.qty
  }));
  const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  const order = await prisma.order.create({
    data: { userId: req.user.id, total, items: { create: orderItems } },
    include: { items: true }
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  res.status(201).json({ order });
}));

module.exports = router;
