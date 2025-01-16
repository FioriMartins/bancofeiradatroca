const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
const { fn } = require('sequelize')
const LogTrans = require('../controllers/transitionController')

exports.models = models

const getProdutos = async (req, res) => {
    const produto = await models.produtos.findAll()
    res.status(200).json(produto)
    log("INFO", "Query produtos executada com sucesso!")
}

const getCaixas = async (req, res) => {
    const caixa = await models.caixas.findAll()
    res.status(200).json(caixa)
    log("INFO", "Query caixas executada com sucesso!")
}


// receber 
const postProdutos = async (req, res) => {
    try {
        const { produtos, comandaId, tipo } = req.body

        if (!produtos || produtos.length === 0) {
            return res.status(400).json({ error: "Nenhum produto enviado." })
        }

        const produtosCadastrados = await models.produtos.bulkCreate(
            produtos.map((produto) => ({
                nome: produto.nome,
                subcategoriaID: produto.subcategoriaID,
                valor: produto.valor,
                estoqueStatus: 0,
                data: fn('CURDATE')
            }))
        )

        LogTrans(produtos, comandaId, tipo)

        res.status(200).json({
            message: "Produtos cadastrados com sucesso.",
            produtos: produtosCadastrados,
        })
        // log("INFO", "Produtos adicionados com sucesso!", produtos)
    } catch (error) {
        console.warn(error)
        // log("ERROR", "Erro ao adicionar produtos.", error)
        res.status(500).json({ error: "Erro interno do servidor." })
    }
}

const postCaixas = async (req, res) => {
    try {
        const { status, turmaID } = req.body

        const caixaCadastrada = await models.caixas.create({
            status: status,
            turmaID: turmaID
        })

        res.status(200).json({
            message: "Caixas cadastrada com sucesso.",
            produtos: caixaCadastrada,
        })
        // log("INFO", "Produtos adicionados com sucesso!", produtos)
    } catch (error) {
        console.warn(error)
        // log("ERROR", "Erro ao adicionar produtos.", error)
        res.status(500).json({ error: "Erro interno do servidor." })
    }
}

const editarCaixas = async (req, res) => {
    const { id } = req.params
    const { status, turmaID } = req.body
    try {
        const caixa = await models.caixas.findByPk(id)
        if (!caixa) {
            return res.status(404).json({ error: 'Caixa não encontrada.' })
        }
        const caixaAtualizada = await caixa.update({
            status,
            turmaID
        })
        res.status(201).json(caixaAtualizada)
        log("INFO", "Caixa editada com sucesso.", id)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message })
    }
}

module.exports = { getProdutos, postProdutos, postCaixas, editarCaixas, getCaixas }