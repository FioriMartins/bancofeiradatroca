const express = require('express');
const { authenticateToken, users, login, register } = require('../controllers/authController');

const router = express.Router();

router.get('/users', users)
router.post('/register', register)
router.post('/login', login)
router.get('/protected', authenticateToken, (req, res) => {
    res.send(`Olá, usuário ${req.user.id}. Esta é uma rota protegida.`);
});

module.exports = router;
