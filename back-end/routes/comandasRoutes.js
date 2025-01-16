const express = require('express')
const sequelize = require('../config/mysql/database')
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
exports.models = models

const {getComanda, postComanda, disableComanda, editComanda, getRegistro} = require('../controllers/comandasController')

const router = express.Router()

router.get('/get', getComanda)
router.post('/post', postComanda)
router.post('/disable', disableComanda)
router.post('/edit', editComanda)

router.get('/registros', getRegistro)

module.exports = router