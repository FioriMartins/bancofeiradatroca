const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('banco', {
    idbanco: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    produtoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produto',
        key: 'idproduto'
      }
    },
    categoriaID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categoria',
        key: 'idcategoria'
      }
    },
    preco: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'banco',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idbanco" },
        ]
      },
      {
        name: "fk_banco_produto_idx",
        using: "BTREE",
        fields: [
          { name: "produtoID" },
        ]
      },
      {
        name: "fk_banco_categoria_idx",
        using: "BTREE",
        fields: [
          { name: "categoriaID" },
        ]
      },
    ]
  });
};
