var DataTypes = require("sequelize").DataTypes;
var _caixas = require("./caixas");
var _categorias = require("./categorias");
var _produtos = require("./produtos");
var _subcategorias = require("./subcategorias");
var _transacoes = require("./transacoes");
var _turmas = require("./turmas");
var _users = require("./users");

function initModels(sequelize) {
  var caixas = _caixas(sequelize, DataTypes);
  var categorias = _categorias(sequelize, DataTypes);
  var produtos = _produtos(sequelize, DataTypes);
  var subcategorias = _subcategorias(sequelize, DataTypes);
  var transacoes = _transacoes(sequelize, DataTypes);
  var turmas = _turmas(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  produtos.belongsTo(caixas, { as: "caixa", foreignKey: "caixaID"});
  caixas.hasMany(produtos, { as: "produtos", foreignKey: "caixaID"});
  subcategorias.belongsTo(categorias, { as: "categorium", foreignKey: "categoriaID"});
  categorias.hasMany(subcategorias, { as: "subcategoria", foreignKey: "categoriaID"});
  produtos.belongsTo(subcategorias, { as: "subcategorium", foreignKey: "subcategoriaID"});
  subcategorias.hasMany(produtos, { as: "produtos", foreignKey: "subcategoriaID"});
  caixas.belongsTo(turmas, { as: "turma", foreignKey: "turmaID"});
  turmas.hasMany(caixas, { as: "caixas", foreignKey: "turmaID"});

  return {
    caixas,
    categorias,
    produtos,
    subcategorias,
    transacoes,
    turmas,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
