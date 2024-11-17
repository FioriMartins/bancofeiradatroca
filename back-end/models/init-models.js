var DataTypes = require("sequelize").DataTypes;
var _caixas = require("./caixas");
var _categorias = require("./categorias");
var _produtos = require("./produtos");
var _transacoes = require("./transacoes");
var _turmas = require("./turmas");

function initModels(sequelize) {
  var caixas = _caixas(sequelize, DataTypes);
  var categorias = _categorias(sequelize, DataTypes);
  var produtos = _produtos(sequelize, DataTypes);
  var transacoes = _transacoes(sequelize, DataTypes);
  var turmas = _turmas(sequelize, DataTypes);

  produtos.belongsTo(caixas, { as: "caixa", foreignKey: "caixaID"});
  caixas.hasMany(produtos, { as: "produtos", foreignKey: "caixaID"});
  produtos.belongsTo(categorias, { as: "categorium", foreignKey: "categoriaID"});
  categorias.hasMany(produtos, { as: "produtos", foreignKey: "categoriaID"});
  caixas.belongsTo(turmas, { as: "turma_turma", foreignKey: "turma"});
  turmas.hasMany(caixas, { as: "caixas", foreignKey: "turma"});

  return {
    caixas,
    categorias,
    produtos,
    transacoes,
    turmas,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
