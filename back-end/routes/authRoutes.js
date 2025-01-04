const express = require('express');
const { register, login, authenticateToken } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authenticateToken, (req, res) => {
    res.send(`Olá, usuário ${req.user.id}. Esta é uma rota protegida.`);
});

module.exports = router;
