const express = require('express')
const sequelize = require('../config/mysql/database');
const { getProdutos, postProdutos } = require('../controllers/productController')
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
exports.models = models

const router = express.Router()

router.post('/receive', postProdutos)
router.get('/get', getProdutos)

module.exports = router