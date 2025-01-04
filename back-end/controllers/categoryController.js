const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')

const getCategorias = async (req, res) => {
    const category = await models.categorias.findAll()
    res.status(200).json(category)
    log("INFO", "Query categorias executada com sucesso!")
}

const getSubcategorias = async (req, res) => {
    const subcategory = await models.subcategorias.findAll()
    res.status(200).json(subcategory)
    log("INFO", "Query subcategorias executada com sucesso!")
}


const postCategorias = async (req, res) => {
    const { nome } = req.body

    try {
        const addCateg = await models.categorias.create({
            nome
        })
        res.status(201).json(addCateg)
        log("INFO", "Categoria adicionada com sucesso!", nome)
    } catch (e) {
        log("ERROR", "Erro ao adicionar uma categoria.", e)
        res.status(500).json({ error: e.message })
    }
}

const postSubcategorias = async (req, res) => {
    const { nome, valor, categoriaID } = req.body

    try {
        const addSubcateg = await models.subcategorias.create({
            nome,
            valor,
            categoriaID
        })
        res.status(201).json(addSubcateg)
        log("INFO", "Subcategoria adicionada com sucesso!", nome)
    } catch (e) {
        log("ERROR", "Erro ao adicionar uma subcategoria.", e)
        res.status(500).json({ error: e.message })
    }
}

module.exports = {getCategorias, getSubcategorias, postCategorias, postSubcategorias}