const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const moment = require("moment")
const { Sequelize, fn, Op, where } = require('sequelize')
const models = initModels(sequelize)
const log = require('../utils/logger')

const { getDocs, collection, query, where: firestoreWhere, Timestamp } = require('firebase/firestore')
const { db } = require('../config/firebase/connect')

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

    return previousMetrics.length;
};

const getMetricsTrans = async (req, res) => {
    const { filter } = req.query;
    let startDate, endDate;

    switch (filter) {
        case "week":
            startDate = moment().startOf("week").format("YYYY-MM-DD")
            endDate = moment().endOf("week").format("YYYY-MM-DD")
            break;
        case "month":
            startDate = moment().startOf("month").format("YYYY-MM-DD")
            endDate = moment().endOf("month").format("YYYY-MM-DD")
            break;
        case "year":
            startDate = moment().startOf("year").format("YYYY-MM-DD")
            endDate = moment().endOf("year").format("YYYY-MM-DD")
            break;
        default:
            return res.status(400).json({ error: "Filtro inválido" });
    }

    try {
        const metrics = await models.transacoes.findAll({
            where: sequelize.where(
                sequelize.fn("DATE", sequelize.col("data")),
                {
                    [Op.between]: [startDate, endDate],
                }
            ),
        });

        const quantidadeElementos = metrics.length

        const previousPeriodCount = await calculatePreviousPeriodTransacoes(filter);

        const increasePercentage = previousPeriodCount > 0
            ? ((quantidadeElementos - previousPeriodCount) / previousPeriodCount) * 100
            : 0;

        const currentPeriodCount = { entrada: 0, saida: 0 }

        metrics.forEach(e => {
            if (e.tipo === "Entrada") {
                currentPeriodCount.entrada += 1
            } else if (e.tipo === "Saída") {
                currentPeriodCount.saida += 1
            }
        });

        res.json({
            filter,
            currentPeriodCount,
            increasePercentage: increasePercentage.toFixed(1),
            data: metrics,
        });

        log("DEBUG", "Sucesso no getMetrics.");
    } catch (error) {
        log("ERROR", "Erro total no getMetrics.", error);
        res.status(500).json({ error: "Erro ao buscar métricas" });
    }
};

const calculatePreviousPeriodTransacoes = async (filter) => {
    let startDate, endDate;

    switch (filter) {
        case "week":
            startDate = moment().subtract(1, "week").startOf("week").format("YYYY-MM-DD")
            endDate = moment().subtract(1, "week").endOf("week").format("YYYY-MM-DD")
            break;
        case "month":
            startDate = moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD")
            endDate = moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD")
            break;
        case "year":
            startDate = moment().subtract(1, "year").startOf("year").format("YYYY-MM-DD")
            endDate = moment().subtract(1, "year").endOf("year").format("YYYY-MM-DD")
            break;
        default:
            return 0; // Caso o filtro não seja válido
    }

    // Consulta no banco de dados para o período anterior
    const previousMetrics = await models.transacoes.findAll({
        where: sequelize.where(
            sequelize.fn("DATE", sequelize.col("data")), // Extrai apenas a data
            {
                [Op.between]: [startDate, endDate], // Filtra entre as datas
            }
        ),
    });

    // Retorna a contagem de produtos no período anterior
    return previousMetrics.length;
};

const getMetricsComandas = async (req, res) => {
    const { filter } = req.query
    let startDate, endDate

    switch (filter) {
        case "week":
            const currentDate = new Date();
            const dayOfWeek = currentDate.getDay();

            // Ajuste para começar a semana no domingo
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - dayOfWeek); // Subtrai o dia da semana para chegar no domingo

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Último dia da semana (sábado)

            startDate = startOfWeek;
            endDate = endOfWeek;
            break
        case "month":
            startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            break
        case "year":
            startDate = new Date(new Date().getFullYear(), 0, 1)
            endDate = new Date(new Date().getFullYear(), 11, 31)
            break
        default:
            return res.status(400).json({ error: "Filtro inválido" })
    }
    const startTimestamp = Timestamp.fromDate(startDate)
    const endTimestamp = Timestamp.fromDate(endDate)

    try {
        const dataComandas = collection(db, "comandas")
        const q = query(
            dataComandas,
            firestoreWhere("ultima_atualizacao", ">=", startTimestamp),
            firestoreWhere("ultima_atualizacao", "<=", endTimestamp)
        )

        const querySnapshot = await getDocs(q)
        const metrics = []
        querySnapshot.forEach((doc) => {
            metrics.push(doc.data())
        })

        const currentPeriodCount = { ativado: 0, desativado: 0 }
        metrics.forEach(e => {
            if (e.ativo === true) {
                currentPeriodCount.ativado += 1
            } else if (e.ativo === false) {
                currentPeriodCount.desativado += 1
            }
        })

        const previousPeriodCount = await calculatePreviousPeriodComandas(filter)

        const increasePercentageAtivados = previousPeriodCount.ativado > 0
            ? ((currentPeriodCount.ativado - previousPeriodCount.ativado) / previousPeriodCount.ativado) * 100
            : 0

        const increasePercentageDesativados = previousPeriodCount.desativado > 0
            ? ((currentPeriodCount.desativado - previousPeriodCount.desativado) / previousPeriodCount.desativado) * 100
            : 0

        res.json({
            filter,
            currentPeriodCount,
            increasePercentageAtivados: increasePercentageAtivados.toFixed(1),
            increasePercentageDesativados: increasePercentageDesativados.toFixed(1),
            data: metrics
        })

        console.log("Sucesso no getMetrics.")
    } catch (error) {
        console.error("Erro ao buscar métricas:", error)
        res.status(500).json({ error: "Erro ao buscar métricas" })
    }
}

const calculatePreviousPeriodComandas = async (filter) => {
    let startDate, endDate

    switch (filter) {
        case "week":
            const currentDate = new Date();
            const dayOfWeek = currentDate.getDay();

            // Ajuste para começar a semana no domingo
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - dayOfWeek); // Subtrai o dia da semana para chegar no domingo

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Último dia da semana (sábado)

            startDate = startOfWeek;
            endDate = endOfWeek;
            break
        case "month":
            startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
            endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0)
            break
        case "year":
            startDate = new Date(new Date().getFullYear() - 1, 0, 1)
            endDate = new Date(new Date().getFullYear() - 1, 11, 31)
            break
        default:
            return { ativado: 0, desativado: 0 }
    }

    const startTimestamp = Timestamp.fromDate(startDate)
    const endTimestamp = Timestamp.fromDate(endDate)

    try {
        const dataComandas = collection(db, "comandas")
        const q = query(
            dataComandas,
            firestoreWhere("ultima_atualizacao", ">=", startTimestamp),
            firestoreWhere("ultima_atualizacao", "<=", endTimestamp)
        )

        const querySnapshot = await getDocs(q)
        const previousMetrics = { ativado: 0, desativado: 0 }
        querySnapshot.forEach((doc) => {
            const docData = doc.data()
            if (docData.ativo === true) {
                previousMetrics.ativado += 1
            } else if (docData.ativo === false) {
                previousMetrics.desativado += 1
            }
        })

        return previousMetrics
    } catch (error) {
        console.error("Erro ao buscar métricas do período anterior:", error)
        return { ativado: 0, desativado: 0 }
    }
}

const getMetricsComandasAtivas = async (req, res) => {
    const { filter } = req.query
    let startDate, endDate

    switch (filter) {
        case "week":
            const currentDate = new Date();
            const dayOfWeek = currentDate.getDay();

            // Ajuste para começar a semana na segunda-feira (se necessário)
            const startOfWeek = new Date(currentDate)
            startOfWeek.setDate(currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
            const endOfWeek = new Date(startOfWeek)
            endOfWeek.setDate(startOfWeek.getDate() + 6)

            startDate = startOfWeek;
            endDate = endOfWeek;
            break
        case "month":
            startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            break
        case "year":
            startDate = new Date(new Date().getFullYear(), 0, 1)
            endDate = new Date(new Date().getFullYear(), 11, 31)
            break
        default:
            return res.status(400).json({ error: "Filtro inválido" })
    }

    const startTimestamp = Timestamp.fromDate(startDate)
    const endTimestamp = Timestamp.fromDate(endDate)

    try {
        const q = query(collection(db, "comandas"), firestoreWhere("ativo", "==", true));

        const querySnapshot = await getDocs(q);
        const metrics = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.ultima_atualizacao >= startTimestamp && data.ultima_atualizacao <= endTimestamp) {
                metrics.push(data);
            }
        });

        const currentPeriodCount = { ativado: 0, desativado: 0 }
        const totalSaldo = metrics.reduce((total, comanda) => {
            const saldo = comanda.saldo || 0
            return Number(total) + saldo
        }, 0)

        const previousPeriodCount = await calculatePreviousPeriodComandasAtivas(filter)

        let variacaoPercentual

        if (previousPeriodCount !== 0) {
            variacaoPercentual = ((totalSaldo - previousPeriodCount) / previousPeriodCount) * 100
        } else {
            variacaoPercentual = 0
        }

        res.json({
            filter,
            currentPeriodCount,
            increasePercentage: variacaoPercentual.toFixed(1),
            data: totalSaldo
        })

        console.log("Sucesso no getMetrics.")
    } catch (error) {
        console.error("Erro ao buscar métricas:", error)
        res.status(500).json({ error: "Erro ao buscar métricas" })
    }
}

const calculatePreviousPeriodComandasAtivas = async (filter) => {
    let startDate, endDate

    switch (filter) {
        case "week":
            const currentDate = new Date();

            currentDate.setDate(currentDate.getDate() - 7);

            const dayOfWeek = currentDate.getDay();

            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            startDate = startOfWeek;
            endDate = endOfWeek;
            break
        case "month":
            startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
            endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0)
            break
        case "year":
            startDate = new Date(new Date().getFullYear() - 1, 0, 1)
            endDate = new Date(new Date().getFullYear() - 1, 11, 31)
            break
        default:
            return { ativado: 0, desativado: 0 }
    }

    const startTimestamp = Timestamp.fromDate(startDate)
    const endTimestamp = Timestamp.fromDate(endDate)

    try {
        const q = query(collection(db, "comandas"), firestoreWhere("ativo", "==", true));

        const querySnapshot = await getDocs(q);
        const metrics = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.ultima_atualizacao >= startTimestamp && data.ultima_atualizacao <= endTimestamp) {
                metrics.push(data);
            }
        });

        const previousMetrics = metrics.reduce((total, comanda) => {
            console.log("semana passada", comanda)
            const saldo = comanda.saldo || 0
            return Number(total) + saldo
        }, 0) || 0

        return previousMetrics
    } catch (error) {
        console.error("Erro ao buscar métricas do período anterior:", error)
        return 0
    }
}

const getMetricsCategorias = async (req, res) => {
    const { filter } = req.query;
    let startDate, endDate;

    switch (filter) {
        case "week":
            startDate = moment().startOf("week").format("YYYY-MM-DD")
            endDate = moment().endOf("week").format("YYYY-MM-DD")
            break;
        case "month":
            startDate = moment().startOf("month").format("YYYY-MM-DD")
            endDate = moment().endOf("month").format("YYYY-MM-DD")
            break;
        case "year":
            startDate = moment().startOf("year").format("YYYY-MM-DD")
            endDate = moment().endOf("year").format("YYYY-MM-DD")
            break;
        default:
            return res.status(400).json({ error: "Filtro inválido" });
    }

    try {
        const metrics = await models.categorias.findAll({
            where: sequelize.where(
                sequelize.fn("DATE", sequelize.col("ultimaAtualizacao")),
                {
                    [Op.between]: [startDate, endDate],
                }
            ),
            order: [["quantidade", "DESC"]],
        })

        const palette = [
            "#349854", // Cor inicial
            "#4CAF77", // Tonalidade mais clara
            "#66C49C", // Tonalidade ainda mais clara
            "#81D1C1", // Cor mais clara
            "#A4E7E5"  // Cor mais clara de todas
        ]

        const metricsAjustado = metrics
            .slice(0, 5)
            .map((e, index) => ({
                id: e.id,
                label: e.nome,
                value: e.quantidade,
                color: palette[index]
            }))

        res.json({
            filter,
            data: metricsAjustado,
        })

        log("DEBUG", "Sucesso no getMetrics.");
    } catch (error) {
        log("ERROR", "Erro total no getMetrics.", error);
        res.status(500).json({ error: "Erro ao buscar métricas" });
    }
}

const getMetricsSubCategorias = async (req, res) => {
    const { filter } = req.query;
    let startDate, endDate;

    switch (filter) {
        case "week":
            startDate = moment().startOf("week").format("YYYY-MM-DD")
            endDate = moment().endOf("week").format("YYYY-MM-DD")
            break;
        case "month":
            startDate = moment().startOf("month").format("YYYY-MM-DD")
            endDate = moment().endOf("month").format("YYYY-MM-DD")
            break;
        case "year":
            startDate = moment().startOf("year").format("YYYY-MM-DD")
            endDate = moment().endOf("year").format("YYYY-MM-DD")
            break;
        default:
            return res.status(400).json({ error: "Filtro inválido" });
    }

    try {
        const metrics = await models.subcategorias.findAll({
            where: sequelize.where(
                sequelize.fn("DATE", sequelize.col("ultimaAtualizacao")),
                {
                    [Op.between]: [startDate, endDate],
                }
            ),
            order: [["quantidade", "DESC"]],
        })

        const palette = [
            "#349854", // Cor inicial
            "#4CAF77", // Tonalidade mais clara
            "#66C49C", // Tonalidade ainda mais clara
            "#81D1C1", // Cor mais clara
            "#A4E7E5"  // Cor mais clara de todas
        ]

        const metricsAjustado = metrics
            .slice(0, 5)
            .map((e, index) => ({
                id: e.id,
                label: e.nome,
                value: e.quantidade,
                categoriaID: e.categoriaID,
                color: palette[index]
            }))

        res.json({
            filter,
            data: metricsAjustado,
        })

        log("DEBUG", "Sucesso no getMetrics.")
    } catch (error) {
        log("ERROR", "Erro total no getMetrics.", error)
        res.status(500).json({ error: "Erro ao buscar métricas" })
    }
}



module.exports = { getMetricsStuff, getMetricsTrans, getMetricsComandas, getMetricsComandasAtivas, getMetricsCategorias, getMetricsSubCategorias }  