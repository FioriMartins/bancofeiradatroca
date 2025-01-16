const express = require('express')
const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
exports.models = models

const router = express.Router()

const {getCategorias, getSubcategorias, postCategorias, postSubcategorias, deleteCategoria, deleteSubCategoria, editarSubCategoria, editarCategoria} = require('../controllers/categoryController');

router.get('/get', getCategorias)
router.get('/get/sub', getSubcategorias)
router.post('/post', postCategorias)
router.post('/post/sub', postSubcategorias)
router.delete('/delete/:id', deleteCategoria)
router.delete('/delete/sub/:id', deleteSubCategoria)
router.put('/edit/sub/:id', editarSubCategoria)
router.put('/edit/:id', editarCategoria)

module.exports = router