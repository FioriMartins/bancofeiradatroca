const db = require('./connection')

const Turma = db.sequelize.define('turma', {
    turmaID: {
        type: db.Sequelize.STRING,
        primaryKey: true 
    }
})

const Cliente = db.sequelize.define('cliente', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: db.Sequelize.STRING,
    },
    turma: {
        type: db.Sequelize.STRING,
        references: 'turma',
        referencesKey: 'turmaID'
    }
})

Turma.hasMany(Cliente)

 Turma.sync({force: true})
 Cliente.sync({force: true})