var DataTypes = require("sequelize").DataTypes;
var _categorias = require("./categorias");
var _produtos = require("./produtos");
var _transacoes = require("./transacoes");
var _turmas = require("./turmas");

function initModels(sequelize) {
  var categorias = _categorias(sequelize, DataTypes);
  var produtos = _produtos(sequelize, DataTypes);
  var transacoes = _transacoes(sequelize, DataTypes);
  var turmas = _turmas(sequelize, DataTypes);

  produtos.belongsTo(categorias, { as: "categorium", foreignKey: "categoriaID"});
  categorias.hasMany(produtos, { as: "produtos", foreignKey: "categoriaID"});
  produtos.belongsTo(turmas, { as: "turma", foreignKey: "turmaId"});
  turmas.hasMany(produtos, { as: "produtos", foreignKey: "turmaId"});

  return {
    categorias,
    produtos,
    transacoes,
    turmas,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
