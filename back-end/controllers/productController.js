const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')

exports.models = models

const getProdutos = async (req, res) => {
    const produto = await models.produtos.findAll()
    res.status(200).json(produto)
    log("INFO", "Query produtos executada com sucesso!")
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
        log("INFO", "Produtos adicionados com sucesso!", produtos)
    } catch (error) {
        console.warn(error)
        log("ERROR", "Erro ao adicionar produtos.", error)
        res.status(500).json({ error: "Erro interno do servidor." })
    }
}

module.exports = {getProdutos, postProdutos}