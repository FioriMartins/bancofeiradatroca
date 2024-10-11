var DataTypes = require("sequelize").DataTypes;
var _banco = require("./banco");
var _categoria = require("./categoria");
var _cliente = require("./cliente");
var _produto = require("./produto");
var _transicao = require("./transicao");
var _turma = require("./turma");

function initModels(sequelize) {
  var banco = _banco(sequelize, DataTypes);
  var categoria = _categoria(sequelize, DataTypes);
  var cliente = _cliente(sequelize, DataTypes);
  var produto = _produto(sequelize, DataTypes);
  var transicao = _transicao(sequelize, DataTypes);
  var turma = _turma(sequelize, DataTypes);

  banco.belongsTo(categoria, { as: "categorium", foreignKey: "categoriaID"});
  categoria.hasMany(banco, { as: "bancos", foreignKey: "categoriaID"});
  banco.belongsTo(produto, { as: "produto", foreignKey: "produtoID"});
  produto.hasMany(banco, { as: "bancos", foreignKey: "produtoID"});
  transicao.belongsTo(produto, { as: "produto", foreignKey: "produtoID"});
  produto.hasMany(transicao, { as: "transicaos", foreignKey: "produtoID"});
  cliente.belongsTo(turma, { as: "turma", foreignKey: "turmaid"});
  turma.hasMany(cliente, { as: "clientes", foreignKey: "turmaid"});

  return {
    banco,
    categoria,
    cliente,
    produto,
    transicao,
    turma,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
