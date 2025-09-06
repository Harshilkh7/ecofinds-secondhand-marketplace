const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { prisma } = require('../db'); // ✅ correct import

// Get all products
router.get('/', asyncHandler(async (req, res) => {
  const { q, category } = req.query;
  const where = { active: true };
  if (category) where.category = category;
  if (q) where.OR = [
    { title: { contains: q, mode: 'insensitive' } },
    { description: { contains: q, mode: 'insensitive' } }
  ];

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  res.json({ products });
}));

// Get product by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json({ product });
}));

// Create product
router.post('/',
  auth,
  body('title').isLength({ min: 2 }),
  body('category').isString(),
  body('price').isFloat({ min: 0 }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description = '', category, price, images = [] } = req.body;

    const product = await prisma.product.create({
      data: {
        sellerId: req.user.id,
        title,
        description,
        category,
        price: Number(price),
        images
      }
    });

    res.status(201).json({ product });
  })
);

// Get logged-in user's products
router.get('/me', auth, asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({ where: { sellerId: req.user.id } });
  res.json({ products });
}));

// Delete product
router.delete('/:id', auth, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: 'Not found' });
  if (product.sellerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  await prisma.product.delete({ where: { id } });
  res.json({ message: 'Deleted' });
}));

module.exports = router;
