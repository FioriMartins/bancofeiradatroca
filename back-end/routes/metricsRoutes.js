const express = require('express')
const sequelize = require('../config/mysql/database')
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
exports.models = models

const {getMetricsStuff, transTipos} = require('../controllers/metricsController')

const router = express.Router()

router.get('/getStuff', getMetricsStuff)
router.get('/getTrans', transTipos)

module.exports = router