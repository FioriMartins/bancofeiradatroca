const Sequelize = require('sequelize')
const express = require('express')
const cors = require('cors')
const initModels = require('./init-models').initModels

require('dotenv').config();

const app = express()
const PORT = process.env.DB_PORT
const HOST = process.env.DB_HOST

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: HOST,
    dialect: "mysql"
})

sequelize.authenticate().then(() => {
    console.log('A conexão com o banco foi realizada com sucesso!')
}).catch((e) => {
    console.log('Não foi possivel realizar a conexão. ' + e)
})

const models = initModels(sequelize)

app.use(cors())
app.use(express.json())

app.get('/admin', async (req, res) => {
    const admin = await models.admin.findAll()
    res.json(admin)
})

app.get('/categoria', async (req, res) => {
    const categorias = await models.categoria.findAll()
    res.json(categorias)
})


// endpoint method post para receber

app.post('/categoria', async (req, res) => {
    const {nome, precodef} = req.body

    try {
        const novosDados = await models.categoria.create({
            nome: nome,
            precodef: precodef
        })
        res.status(201).json(novosDados)
    } catch (e) {
        res.status(500).json({e: 'Erro ao criar usuário'})
        console.log(e)
    }
})

app.listen(PORT, () => {
    console.log('Servidor rodando')
})
