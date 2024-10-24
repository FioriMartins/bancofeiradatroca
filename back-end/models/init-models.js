var DataTypes = require("sequelize").DataTypes;
var _caixas = require("./caixas");
var _categorias = require("./categorias");
var _produtos = require("./produtos");
var _transicao = require("./transicao");
var _turmas = require("./turmas");

function initModels(sequelize) {
  var caixas = _caixas(sequelize, DataTypes);
  var categorias = _categorias(sequelize, DataTypes);
  var produtos = _produtos(sequelize, DataTypes);
  var transicao = _transicao(sequelize, DataTypes);
  var turmas = _turmas(sequelize, DataTypes);

  produtos.belongsTo(caixas, { as: "caixa", foreignKey: "caixaID"});
  caixas.hasMany(produtos, { as: "produtos", foreignKey: "caixaID"});
  produtos.belongsTo(categorias, { as: "categorium", foreignKey: "categoriaID"});
  categorias.hasMany(produtos, { as: "produtos", foreignKey: "categoriaID"});
  transicao.belongsTo(produtos, { as: "produto", foreignKey: "produtoID"});
  produtos.hasMany(transicao, { as: "transicaos", foreignKey: "produtoID"});
  caixas.belongsTo(turmas, { as: "turma_turma", foreignKey: "turma"});
  turmas.hasMany(caixas, { as: "caixas", foreignKey: "turma"});

  return {
    caixas,
    categorias,
    produtos,
    transicao,
    turmas,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
