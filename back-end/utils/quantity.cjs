const axios = require('axios')
const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const { Sequelize, fn, Op, where } = require('sequelize')
const models = initModels(sequelize)

async function VerifyQuantity () {
    try {
        const response1 = await axios.get('http://localhost:3000/categories/get')
        const response2 = await axios.get('http://localhost:3000/categories/get/sub')
        const response3 = await axios.get('http://localhost:3000/stock/get')
        const data1 = response2.data
        const data2 = response3.data

        const quantidades = data1.map((e) => ({
            id: e.id,
            quantidade: e.quantidade
        })) 

        const produtos = data2.map((e) => ({
            id: e.id,
            subId: e.subcategoriaID
        }))

        quantidades.forEach(async (e) => {
            if (e.quantidade === 0 || e.quantidade === null) {
                let i = 0
                produtos.forEach(async (el) => {
                    if (el.subId === e.id) {
                        i++
                        let result = await models.subcategorias.update(
                            {
                                quantidade: i
                            }, 
                            {
                                where: {id: e.id}
                            }
                        )
                    }
                })
            }
        })
    } catch (err) {
        console.error("ERRO AO VERIFICAR QUANTIDADE: ", err)
    }
}

// VerifyQuantity()

async function teste () {
    await models.subcategorias.update(
        {
            quantidade: 1
        }, 
        {
            where: {id: 2}
        }
    )
}


teste ()