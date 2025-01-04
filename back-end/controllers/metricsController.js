const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')

const getMetricsStuff = async (req, res) => {
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

const transTipos = async (req, res) => {
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
}

module.exports = {getMetricsStuff, transTipos}