const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const log = require('../utils/logger');

const models = initModels(sequelize)


// middleware abaixo

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Token não fornecido');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Token inválido');
    req.user = user;
    next();
  });
};

// middleware acima

const users = async (req, res) => {
    try {
        const usernames = await models.users.findAll({
            attributes: ['username', 'id'],
        })

        res.json(usernames)
        log("INFO", `Todos os usernames foram requisitados!`, usernames)
    } catch (err) {
        log("ERROR", `ERRO AO TENTAR REQUIRIR OS USERNAMES.`)
        console.error(err)
        res.status(500).send('Erro ao buscar usernames')
    }
}

const register = async (req, res) => {
    const { username, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await models.users.create({ username, password: hashedPassword })
        res.status(201).send('Usuário registrado com sucesso!!')
        log("DEBUG", `Usuário ${username} registrado com sucesso.`)
    } catch (err) {
        res.status(400).send('Erro ao registrar usuário.')
    }
}

const login = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await models.users.findOne({ where: { username } })
        if (!user) return res.status(404).send('usuario nao encontrado')

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(401).send('senha invalida')

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ message: 'login bem-sucedido', token })
    } catch (err) {
        res.status(500).send('Erro no login')
    }
}

module.exports = { authenticateToken, users, register, login };
