const Sequelize = require('sequelize')
const express = require('express')

const sequelize = new Sequelize('feiradatroca', 'fiori', 'Julialinda1!', {
    host: "localhost",
    dialect: "mysql"
})

sequelize.authenticate().then(() => {
    console.log('A conexão com o banco foi realizada com sucesso!')
}).catch((e) => {
    console.log('Não foi possivel realizar a conexão. ' + e)
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}