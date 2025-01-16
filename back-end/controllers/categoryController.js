const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const {fn} = require('sequelize')
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
            nome,
            ultimaAtualizacao: fn('CURDATE')
        })
        res.status(201).json(addCateg)
        log("INFO", "Categoria adicionada com sucesso!", nome)
    } catch (e) {
        log("ERROR", "Erro ao adicionar uma categoria.", e)
        res.status(500).json({ error: e.message })
        console.error(e)
    }
}

const postSubcategorias = async (req, res) => {
    const { subcategorias } = req.body

    try {
        const addSubcateg = await models.subcategorias.bulkCreate(
            subcategorias.map((subcategoria) => ({
                nome: subcategoria.nome,
                valor: subcategoria.valor,
                categoriaID: subcategoria.categoriaID,
                ultimaAtualizacao: fn('CURDATE')
            }))
        )
        res.status(201).json(addSubcateg)
    } catch (e) {
        log("ERROR", "Erro ao adicionar uma subcategoria.", e)
        res.status(500).json({ error: e.message })
    }
}

const deleteCategoria = async (req, res) => {
    const { id } = req.params
    try {
        const categoria = await models.categorias.findByPk(id)
        if (!categoria) {
            return res.status(404).json({ error: 'Categoria nao encontrada' })
        }
        await categoria.destroy()
        res.status(200).json({ message: 'Categoria deletada com sucesso!' })
        log("WARN", "Categoria deletada com sucesso.", id)
    } catch (err) {
        log("ERROR", "Erro ao deletar uma categoria.", err)
        res.status(500).json(err)
    }
}

 const deleteSubCategoria = async (req, res) => {
    const { id } = req.params
    try {
        const subcategoria = await models.subcategorias.findByPk(id)
        if (!subcategoria) {
            return res.status(404).json({ error: 'Subcategoria nao encontrada' })
        }
        await subcategoria.destroy()
        res.status(200).json({ message: 'Subcategoria deletada com sucesso!' })
        log("WARN", "Subcategoria deletada com sucesso.", id)
    } catch (err) {
        log("ERROR", "Erro ao deletar uma subcategoria.", err)
        res.status(500).json({ error: err.message })
    }
}

const editarSubCategoria = async (req, res) => {
    const { id } = req.params
    const { nome, valor, categoriaID } = req.body
    try {
        const subcategoria = await models.subcategorias.findByPk(id)
        if (!subcategoria) {
            return res.status(404).json({ error: 'Subcategoria nao encontrada' })
        }
        const subcategoriaAtualizado = await subcategoria.update({
            nome,
            valor,
            categoriaID
        })
        res.status(201).json(subcategoriaAtualizado)
        log("INFO", "Subcategoria editada com sucesso.", id)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message })
    }
}

const editarCategoria = async (req, res) => {
    const { id } = req.params
    const { nome } = req.body
    try {
        const categoria = await models.categorias.findByPk(id)
        if (!categoria) {
            return res.status(404).json({ error: 'Categoria nao encontrada' })
        }
        const categoriaAtualizado = await categoria.update({
            nome,
        })
        res.status(201).json(categoriaAtualizado)
        log("INFO", "Categoria editada com sucesso.", id)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message })
    }
}

module.exports = { getCategorias, getSubcategorias, postCategorias, postSubcategorias, deleteCategoria, deleteSubCategoria, editarSubCategoria, editarCategoria }