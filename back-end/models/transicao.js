const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transicao', {
    idtransicao: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    produtoID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'produto',
        key: 'idproduto'
      }
    },
    preco: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'transicao',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idtransicao" },
        ]
      },
      {
        name: "fk_transicao_produto_idx",
        using: "BTREE",
        fields: [
          { name: "produtoID" },
        ]
      },
    ]
  });
};
