const express = require('express')
const sequelize = require('../config/mysql/database')
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
exports.models = models

const {getMetricsStuff, getMetricsTrans, getMetricsComandas} = require('../controllers/metricsController')

const router = express.Router()

router.get('/getStuff', getMetricsStuff)
router.get('/getTrans', getMetricsTrans)
router.get('/getComandas', getMetricsComandas)

module.exports = router