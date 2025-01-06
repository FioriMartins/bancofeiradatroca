const express = require('express')
const sequelize = require('../config/mysql/database')
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
exports.models = models

const {getComanda, postComanda, disableComanda, editComanda} = require('../controllers/comandasController')

const router = express.Router()

router.get('/get', getComanda)
router.post('/post', postComanda)
router.post('/disable', disableComanda)
router.post('/edit', editComanda)

module.exports = router