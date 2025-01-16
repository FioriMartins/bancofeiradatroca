const express = require('express')
const sequelize = require('../config/mysql/database');
const { getProdutos, postProdutos, postCaixas, editarCaixas, getCaixas } = require('../controllers/productController')
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
exports.models = models

const router = express.Router()

router.post('/receive', postProdutos)
router.get('/get', getProdutos)

router.post('/box/post', postCaixas)
router.put('/box/edit', editarCaixas)
router.get('/box/get', getCaixas)

module.exports = router