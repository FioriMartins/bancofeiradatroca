const Sequelize = require('sequelize')
const cors = require('cors')
const initModels = require('../models/init-models').initModels
const XLSX = require('xlsx')

require('dotenv').config();

const PORT = process.env.PORT
const HOST = process.env.DB_HOST
const ADDRESS = process.env.ADDRESS

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

// Função para exportar os dados do banco em uma planilha
async function exportarDados() {
    try {
      // Obter dados do banco
      const trans = await models.transacoes.findAll({ raw: true });
  
      // Converter os dados em uma planilha
      const ws = XLSX.utils.json_to_sheet(trans);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Transacoes');
  
      // Salvar o arquivo localmente
      XLSX.writeFile(wb, 'backup-produtos.xlsx');
      console.log('Backup gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar o backup:', error);
    }
  }
  
  exportarDados()