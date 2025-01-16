const express = require('express')
const sequelize = require('../config/mysql/database')
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
exports.models = models

const {getMetricsStuff, getMetricsTrans, getMetricsComandas, getMetricsCategorias, getMetricsSubCategorias, getMetricsComandasAtivas} = require('../controllers/metricsController')

const router = express.Router()

router.get('/getStuff', getMetricsStuff)
router.get('/getTrans', getMetricsTrans)
router.get('/getComandas', getMetricsComandas)
router.get('/getComandasAtivas', getMetricsComandasAtivas)
router.get('/getCategorias', getMetricsCategorias)
router.get('/getSubCategorias', getMetricsSubCategorias)

module.exports = router