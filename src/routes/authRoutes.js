const express = require('express');
const { register, login, getUser } = require('../controllers/authController');
const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateUser, getUser);

module.exports = router;