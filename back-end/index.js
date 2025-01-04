const { Sequelize, fn, Op, where } = require('sequelize')
const moment = require("moment")
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const initModels = require('./models/init-models').initModels

const chalk = require('chalk');

require('dotenv').config();

const app = express()
exports.app = app
const PORT = process.env.PORT
const HOST = process.env.DB_HOST
const ADDRESS = process.env.ADDRESS

const corsOptions = {
    origin: ADDRESS,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
}
exports.corsOptions = corsOptions

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
exports.log = log

sequelize.authenticate().then(() => {
    console.log('A conexão com o banco foi realizada com sucesso!')
}).catch((e) => {
    console.log('Não foi possivel realizar a conexão. ' + e)
})
// log("INFO", "Produto adicionado com sucesso!");

const models = initModels(sequelize)
exports.models = models

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

// dados metricos

// controller para metricas

const getMetrics = async (req, res) => {
    const { filter } = req.query; // captura o filtro enviado pelo cliente
    let startDate, endDate;

    // Define as datas com base no filtro
    switch (filter) {
        case "week":
            startDate = moment().startOf("week").format("YYYY-MM-DD");
            endDate = moment().endOf("week").format("YYYY-MM-DD");
            break;
        case "month":
            startDate = moment().startOf("month").format("YYYY-MM-DD");
            endDate = moment().endOf("month").format("YYYY-MM-DD");
            break;
        case "year":
            startDate = moment().startOf("year").format("YYYY-MM-DD");
            endDate = moment().endOf("year").format("YYYY-MM-DD");
            break;
        default:
            return res.status(400).json({ error: "Filtro inválido" });
    }

    console.log(`Filtros aplicados: startDate = ${startDate}, endDate = ${endDate}`); // Log para verificar as datas

    try {
        // Consulta no banco de dados com Sequelize
        const metrics = await models.produtos.findAll({
            where: sequelize.where(
                sequelize.fn("DATE", sequelize.col("data")), // Extrai apenas a data
                {
                    [Op.between]: [startDate, endDate], // Filtra entre as datas
                }
            ),
        });

        console.log(`Produtos no período atual: ${metrics.length}`); // Verifica quantos produtos estão retornando

        // Contagem de produtos no período atual
        const currentPeriodCount = metrics.length;

        // Calcula a quantidade de produtos no período anterior
        const previousPeriodCount = await calculatePreviousPeriod(filter);

        console.log(`Produtos no período anterior: ${previousPeriodCount}`); // Verifica a quantidade do período anterior

        // Cálculo da variação percentual
        const increasePercentage = previousPeriodCount > 0
            ? ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100
            : 0;

        console.log(`Variação percentual: ${increasePercentage}`); // Verifica o cálculo da variação

        // Retorna os dados
        res.json({
            filter,
            currentPeriodCount,
            increasePercentage: increasePercentage.toFixed(2), // Formata com 2 casas
            data: metrics,
        });

        log("DEBUG", "Sucesso no getMetrics.");
    } catch (error) {
        log("ERROR", "Erro total no getMetrics.");
        console.error(error); // Log do erro
        res.status(500).json({ error: "Erro ao buscar métricas" });
    }
};

const calculatePreviousPeriod = async (filter) => {
    let startDate, endDate;

    switch (filter) {
        case "week":
            startDate = moment().subtract(1, "week").startOf("week").format("YYYY-MM-DD");
            endDate = moment().subtract(1, "week").endOf("week").format("YYYY-MM-DD");
            break;
        case "month":
            startDate = moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD");
            endDate = moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD");
            break;
        case "year":
            startDate = moment().subtract(1, "year").startOf("year").format("YYYY-MM-DD");
            endDate = moment().subtract(1, "year").endOf("year").format("YYYY-MM-DD");
            break;
        default:
            return 0; // Caso o filtro não seja válido
    }

    console.log(`Datas do período anterior: startDate = ${startDate}, endDate = ${endDate}`); // Log para verificar as datas

    // Consulta no banco de dados para o período anterior
    const previousMetrics = await models.produtos.findAll({
        where: sequelize.where(
            sequelize.fn("DATE", sequelize.col("data")), // Extrai apenas a data
            {
                [Op.between]: [startDate, endDate], // Filtra entre as datas
            }
        ),
    });

    console.log(`Produtos no período anterior: ${previousMetrics.length}`); // Verifica quantos produtos retornaram

    // Retorna a contagem de produtos no período anterior
    return previousMetrics.length;
};

app.get('/metricsTest', getMetrics);



app.get('/graficos/transacoes/tipos', async (req, res) => {
    try {
        const quantidadeEntrada = await models.transacoes.count({
            where: {
                tipo: "Entrada"
            }
        })

        const quantidadeSaida = await models.transacoes.count({
            where: {
                tipo: "Saída"
            }
        })

        res.json({
            entrada: quantidadeEntrada,
            saida: quantidadeSaida
        })
    } catch (err) {
        log("ERROR", "Erro ao calcular as metricas de transacoes.", err)
        res.status(500).json({ message: 'Erro ao buscar transacoes' })
    }
})

app.get('/graficos/produtos/quantidade', async (req, res) => {
    try {
        const quantidade = await models.produtos.count()

        res.json(quantidade)
    } catch (err) {
        log("ERROR", "Erro ao calcular as metricas de produtos.", err)
        res.status(500).json({ message: 'Erro ao buscar produtos' })
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
            tipo: tipo,
            data: fn('CURDATE')
        })
    } catch (err) {

    }
}

app.listen(PORT, () => {
    console.log('Servidor rodando')
})