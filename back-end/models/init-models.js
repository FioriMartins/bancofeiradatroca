var DataTypes = require("sequelize").DataTypes;
var _admin = require("./admin");
var _banco = require("./banco");
var _categoria = require("./categoria");
var _cliente = require("./cliente");
var _produto = require("./produto");
var _transicao = require("./transicao");

function initModels(sequelize) {
  var admin = _admin(sequelize, DataTypes);
  var banco = _banco(sequelize, DataTypes);
  var categoria = _categoria(sequelize, DataTypes);
  var cliente = _cliente(sequelize, DataTypes);
  var produto = _produto(sequelize, DataTypes);
  var transicao = _transicao(sequelize, DataTypes);

  banco.belongsTo(categoria, { as: "categorium", foreignKey: "categoriaID"});
  categoria.hasMany(banco, { as: "bancos", foreignKey: "categoriaID"});
  banco.belongsTo(produto, { as: "produto", foreignKey: "produtoID"});
  produto.hasMany(banco, { as: "bancos", foreignKey: "produtoID"});
  transicao.belongsTo(produto, { as: "produto", foreignKey: "produtoID"});
  produto.hasMany(transicao, { as: "transicaos", foreignKey: "produtoID"});

  return {
    admin,
    banco,
    categoria,
    cliente,
    produto,
    transicao,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;