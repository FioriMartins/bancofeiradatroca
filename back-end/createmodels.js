const SequelizeAuto = require('sequelize-auto')
const auto = new SequelizeAuto('feiradatroca', 'fiori', 'Julialinda1!', {
    dialect: 'mysql',
})

auto.run().then(data => {
    console.log(data.tables)
    console.log(data.foreignKeys)
})