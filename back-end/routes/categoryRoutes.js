const express = require('express')
const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
exports.models = models

const router = express.Router()

const {getCategorias, getSubcategorias, postCategorias, postSubcategorias} = require('../controllers/categoryController');

router.get('/query', getCategorias)
router.get('/query/sub', getSubcategorias)
router.post('/post', postCategorias)
router.post('/post/sub', postSubcategorias)

module.exports = router