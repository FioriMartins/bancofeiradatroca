const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transicao', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sala: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    produtoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produtos',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'transicao',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
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
