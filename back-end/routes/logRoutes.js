const express = require('express')
const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
exports.models = models

const {getTrans} = require('../controllers/transitionController')

const router = express.Router()

router.get('/transacoes', getTrans)

module.exports = router