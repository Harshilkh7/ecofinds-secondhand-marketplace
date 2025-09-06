const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { prisma } = require('../db'); // ✅ Correct import

// Add to cart
router.post('/', auth, asyncHandler(async (req, res) => {
  const { productId } = req.body;
  console.log(req.user.id);
  console.log(productId);
  
  

  const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: req.user.id } });
  }

  await prisma.cartItem.create({ data: { cartId: cart.id, productId: product.id, qty: 1 } });
  res.json({ message: 'Added to cart' });
}));

// Get cart
router.get('/', auth, asyncHandler(async (req, res) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } }
  });
  res.json({ cart: cart ? cart : { items: [] } });
}));

// Remove from cart
router.delete('/:id', auth, asyncHandler(async (req, res) => {
  await prisma.cartItem.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Removed from cart' });
}));

module.exports = router;
