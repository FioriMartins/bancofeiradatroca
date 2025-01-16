const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const {fn} = require('sequelize')
const models = initModels(sequelize)
const log = require('../utils/logger')


async function LogTrans(produtos, comandaId, tipo) {
    const now = new Date()
    const timestamp = now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    try {
        await models.transacoes.create({
            comandaId: comandaId,
            detalhesJson: produtos,
            timestamp: timestamp,
            tipo: tipo,
            data: fn('CURDATE')
        })
    } catch (err) {
        console.log(err)
    }
}

const getTrans = async (req, res) => {
    const trans = await models.transacoes.findAll()
    res.status(200).json(trans)
    log("INFO", "Query produtos executada com sucesso!")
}

module.exports = {LogTrans, getTrans}