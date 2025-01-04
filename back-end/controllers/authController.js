const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models/init-models').initModels;
const log = require('../utils/logger');

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await models.users.create({ username, password: hashedPassword });
    res.status(201).send('Usuário registrado com sucesso!');
    log("DEBUG", `Usuário ${username} registrado.`);
  } catch (err) {
    res.status(400).send('Erro ao registrar usuário.');
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await models.users.findOne({ where: { username } });
    if (!user) return res.status(404).send('Usuário não encontrado');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Senha inválida');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login bem-sucedido', token });
  } catch (err) {
    res.status(500).send('Erro no login');
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Token não fornecido');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Token inválido');
    req.user = user;
    next();
  });
};

module.exports = { register, login, authenticateToken };
