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
    res.status(200).json(turmas)
})

app.get('/transacoes', async (req, res) => {
    const trans = await models.transacoes.findAll()
    res.status(200).json(trans)
})

app.get('/caixas', async (req, res) => {
    const caixas = await models.caixas.findAll()
    res.status(200).json(caixas)
})

app.get('/categorias', async (req, res) => {
    const category = await models.categorias.findAll()
    res.status(200).json(category)
})

app.get('/subcategorias', async (req, res) => {
    const subcategory = await models.subcategorias.findAll()
    res.status(200).json(subcategory)
})

app.get('/produtos', async (req, res) => {
    const produto = await models.produtos.findAll()
    res.status(200).json(produto)
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

app.post('/produtos/receive', async (req, res) => {
    const {nome, subcategoriaID, caixaID, estoqueStatus, valor} = req.body

    try {
        const addProduto = await models.produtos.create({
            nome, 
            subcategoriaID,
            caixaID,
            estoqueStatus,
            valor
        })
        res.status(201).json(addProduto)
    } catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
})

// endpoint para deletar

app.delete('/categorias/:id', async (req, res) => {
    const {id} = req.params

    try {
        const categoria = await models.categorias.findByPk(id)

        if (!categoria) {
            return res.status(404).json({error: 'Categoria nao encontrada'})
        }

        await categoria.destroy()

        res.status(200).json({message: 'Categoria deletada com sucesso!'})
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

app.delete('/subcategorias/:id', async (req, res) => {
    const {id} = req.params

    try {
        const subcategoria = await models.subcategorias.findByPk(id)

        if (!subcategoria) {
            return res.status(404).json({error: 'Subcategoria nao encontrada'})
        }

        await subcategoria.destroy()

        res.status(200).json({message: 'Subcategoria deletada com sucesso!'})
    } catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
})

// endpoint para put

app.put('/subcategorias/edit/:id', async (req, res) => {
    const {id} = req.params
    const {nome, valor, categoriaID} = req.body

    try {
        const subcategoria = await models.subcategorias.findByPk(id)

        if(!subcategoria) {
            return res.status(404).json({error: 'Subcategoria nao encontrada'})
        }

        const subcategoriaAtualizado = await subcategoria.update({
            nome,
            valor,
            categoriaID
        })

        res.status(201).json(subcategoriaAtualizado)
    } catch (e) {
        console.error(e)
        res.status(500).json({error: e.message})
    }
})


app.listen(PORT, () => {
    console.log('Servidor rodando')
})
