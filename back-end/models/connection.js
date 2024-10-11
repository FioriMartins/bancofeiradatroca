const Sequelize = require('sequelize')
const express = require('express')
const cors = require('cors')
const initModels = require('./init-models').initModels

const sequelize = new Sequelize('feiradatroca', 'fiori', 'Julialinda1!', {
    host: "localhost",
    dialect: "mysql"
})

sequelize.authenticate().then(() => {
    console.log('A conexão com o banco foi realizada com sucesso!')
}).catch((e) => {
    console.log('Não foi possivel realizar a conexão. ' + e)
})

const models = initModels(sequelize)

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.get('/admin', async (req, res) => {
    const admin = await models.admin.findAll()
    res.json(admin)
})

app.listen(PORT, () => {
    console.log('Servidor rodando')
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}