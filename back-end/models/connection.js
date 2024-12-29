const Sequelize = require('sequelize')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const initModels = require('./init-models').initModels

const chalk = require('chalk');

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

const log = (level, message, data = null) => {
    const colors = {
        INFO: { text: chalk.green, bg: chalk.bgGreen.black },
        WARN: { text: chalk.yellow, bg: chalk.bgYellow.black },
        ERROR: { text: chalk.red, bg: chalk.bgRed.white },
        DEBUG: { text: chalk.blue, bg: chalk.bgBlue.white },
    };

    const now = new Date()
    const timestamp = now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

    const color = colors[level.toUpperCase()] || { text: chalk.white, bg: chalk.bgWhite.black }

    console.log(
        color.text(`[${level}] ${timestamp} - `) +
        color.bg(` ${message} `) // Mensagem com fundo colorido
    );
    if (data) console.log(chalk.gray(`Detalhes: ${JSON.stringify(data, null, 2)}`))
};

sequelize.authenticate().then(() => {
    console.log('A conexão com o banco foi realizada com sucesso!')
}).catch((e) => {
    console.log('Não foi possivel realizar a conexão. ' + e)
})
// log("INFO", "Produto adicionado com sucesso!");

const models = initModels(sequelize)

// login de usuario

app.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await models.users.findOne({ where: { username } })
        if (!user) return res.status(404).send('usuario nao encontrado')

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(401).send('senha invalida')

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ message: 'login bem-sucedido', token })
    } catch (err) {
        res.status(500).send('Erro no login')
    }
})

// middleware para verificar autenticacao

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    console.log(token)

    if (!token) return res.status(401).send('Token não fornecido')

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Token inválido')
        req.user = user
        next()
    });
};

app.get('/protected', authenticateToken, (req, res) => {
    console.log("ue")
    res.send(`Olá, usuário ${req.user.id}. Esta é uma rota protegida.`);
})

// registro de usuario:

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await models.users.create({ username, password: hashedPassword })
        res.status(201).send('Usuário registrado com sucesso!!')
        log("DEBUG", `Usuário ${username} registrado com sucesso.`)
    } catch (err) {
        res.status(400).send('Erro ao registrar usuário.')
    }
})

// findAll 

app.get('/users', async (req, res) => {
    try {
        const usernames = await models.users.findAll({
            attributes: ['username', 'id'],
        })

        res.json(usernames)
        log("INFO", `Todos os usernames foram requisitados!`, usernames)
    } catch (err) {
        log("ERROR", `ERRO AO TENTAR REQUIRIR OS USERNAMES.`, err)
        res.status(500).send('Erro ao buscar usernames')
    }
})

app.get('/turmas', async (req, res) => {
    const turmas = await models.turmas.findAll()
    res.status(200).json(turmas)
    log("INFO", "Query turmas executada com sucesso!")
})

app.get('/transacoes', async (req, res) => {
    const trans = await models.transacoes.findAll()
    res.status(200).json(trans)
    log("INFO", "Query transacoes executada com sucesso!")
})

app.get('/caixas', async (req, res) => {
    const caixas = await models.caixas.findAll()
    res.status(200).json(caixas)
    log("INFO", "Query caixas executada com sucesso!")
})

app.get('/categorias', async (req, res) => {
    const category = await models.categorias.findAll()
    res.status(200).json(category)
    log("INFO", "Query categorias executada com sucesso!")
})

app.get('/subcategorias', async (req, res) => {
    const subcategory = await models.subcategorias.findAll()
    res.status(200).json(subcategory)
    log("INFO", "Query subcategorias executada com sucesso!")
})

app.get('/produtos', async (req, res) => {
    const produto = await models.produtos.findAll()
    res.status(200).json(produto)
    log("INFO", "Query produtos executada com sucesso!")
})

// endpoint method post para receber

app.post('/turmas/receive', async (req, res) => {
    const { id, patrono, descricao } = req.body

    try {
        const addTurma = await models.turmas.create({
            id,
            patrono,
            descricao
        })
        res.status(201).json(addTurma)
        log("INFO", "Turma adicionada com sucesso!", id)
    } catch (e) {
        log("ERROR", "Erro ao adicionar uma turma.", e)
        res.status(500).json({ error: e.message })
    }
})

app.post('/caixas/receive', async (req, res) => {
    const { produtos, status, turmaID } = req.body

    try {
        const addCaixa = await models.caixas.create({
            produtos,
            status,
            turmaID
        })
        res.status(201).json(addCaixa)
        log("INFO", "Caixa adicionada com sucesso!", produtos)
    } catch (e) {
        log("ERROR", "Erro ao adicionar uma caixa.", e)
        res.status(500).json({ error: e.message })
    }
})

app.post('/categorias/receive', async (req, res) => {
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
})

app.post('/subcategorias/receive', async (req, res) => {
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
})

app.post("/produtos/receive", async (req, res) => {
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
            }))
        )

        LogTrans(produtos, comandaId, tipo)

        res.status(200).json({
            message: "Produtos cadastrados com sucesso.",
            produtos: produtosCadastrados,
        })
        log("INFO", "Produtos adicionados com sucesso!", produtos)
    } catch (error) {
        log("ERROR", "Erro ao adicionar produtos.", error)
        res.status(500).json({ error: "Erro interno do servidor." })
    }
});

// endpoint para deletar

app.delete('/categorias/:id', async (req, res) => {
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
})

app.delete('/subcategorias/:id', async (req, res) => {
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
        log("WARN", "Erro ao deletar uma subcategoria.", err)
        res.status(500).json({ error: err.message })
    }
})

// endpoint para put

app.put('/subcategorias/edit/:id', async (req, res) => {
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
})

// funcao para log de transacao

async function LogTrans(produtos, comandaId, tipo) {
    const now = new Date()
    const timestamp = now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    try {
        await models.transacoes.create({
            comandaId: comandaId,
            detalhesJson: produtos,
            timestamp: timestamp,
            tipo: tipo
        })
    } catch (err) {

    }
}

app.listen(PORT, () => {
    console.log('Servidor rodando')
})