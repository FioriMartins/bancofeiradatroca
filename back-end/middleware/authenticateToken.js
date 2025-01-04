const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models/init-models').initModels;
const log = require('../utils/logger');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    console.log(token)

    if (!token) return res.status(401).send('Token não fornecido')

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Token inválido')
        req.user = user
        next()
    });
};

app.get('/protected', authenticateToken, (req, res) => {
    res.send(`Olá, usuário ${req.user.id}. Esta é uma rota protegida.`);
})