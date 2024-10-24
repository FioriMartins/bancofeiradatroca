const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('produtos', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    categoriaID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'id'
      }
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    caixaID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'caixas',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'produtos',
    timestamps: false,
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
        name: "fk_produtos_categoria_idx",
        using: "BTREE",
        fields: [
          { name: "categoriaID" },
        ]
      },
      {
        name: "fk_produtos_caixa_idx",
        using: "BTREE",
        fields: [
          { name: "caixaID" },
        ]
      },
    ]
  });
};
