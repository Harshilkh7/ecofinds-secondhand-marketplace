const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');
const prisma = require('../db');
const auth = require('../middleware/auth');

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });

// Signup
router.post('/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('username').isLength({ min: 2 }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, username } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, username } });

    const token = makeToken(user.id);
    res.status(201).json({ token });
  })
);

// Login
router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = makeToken(user.id);
    res.json({ token });
  })
);

// Me
router.get('/me', auth, asyncHandler(async (req, res) => {
  const { id, email, username } = req.user;
  res.json({ user: { id, email, username } });
}));

module.exports = router;
