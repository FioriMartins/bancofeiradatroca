const Sequelize = require('sequelize')
const express = require('express')
const cors = require('cors')
const initModels = require('./init-models').initModels

require('dotenv').config();

const app = express()
const PORT = process.env.PORT
const HOST = process.env.DB_HOST
const ADDRESS = process.env.ADDRESS

const corsOptions = {
    origin: ADDRESS,
    methods: 'GET,POST,PUT,DELETE,OPTIONS', 
    allowedHeaders: ['Content-Type', 'Authorization'],  
}

app.use(cors(corsOptions))

app.options('*', cors(corsOptions))

app.use(express.json())

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

app.get('/turmas', async (req, res) => {
    const turmas = await models.turmas.findAll()
    res.json(turmas)
})

app.get('/transacoes', async (req, res) => {
    const trans = await models.transacoes.findAll()
    res.json(trans)
})

app.get('/caixas', async (req, res) => {
    const caixas = await models.caixas.findAll()
    res.json(caixas)
})

app.get('/categorias', async (req, res) => {
    const category = await models.categorias.findAll()
    res.json(category)
})

// endpoint method post para receber
app.post('/turmas/receive', async (req, res) => {
    const {id, patrono, descricao } = req.body
    console.log(id, patrono, descricao)

    try {
        const addTurma = await models.turmas.create({
            id,
            patrono,
            descricao
        })
        res.status(201).json(addTurma)
    } catch (e) {
        console.log(e)
        res.status(500).json({error: e.message})
    }
})

app.post('/caixas/receive', async (req, res) => {
    const {produtos, status, turmaID} = req.body

    try {
        const addCaixa = await models.caixas.create({
            produtos,
            status,
            turmaID
        })
        res.status(201).json(addCaixa)
    } catch (e) {
        console.error(e)
        res.status(500).json({error: e.message})
    }
})

app.post('/categorias/receive', async (req, res) => {
    const {nome} = req.body

    try {
        const addCateg = await models.categorias.create({
            nome
        })
        res.status(201).json(addCateg)
    } catch (e) {
        console.error(e)
        res.status(500).json({error: e.message})
    }
})

app.post('/transicoes/receive', async (req, res) => {
    const {descricao, horario, dia, comandaId, detalhesJson} = req.body

    try {
        const addTrans = await models.transacoes.create({
            descricao,
            horario,
            dia,
            comandaId,
            detalhesJson
        })
        res.status(201).json(addTrans)
    } catch (e) {
        console.error(e)
        res.status(500).json({error: e.message})
    }
})

app.listen(PORT, () => {
    console.log('Servidor rodando')
})
