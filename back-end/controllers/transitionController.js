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

module.exports = {LogTrans}