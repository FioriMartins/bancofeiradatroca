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
    subcategoriaID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subcategorias',
        key: 'id'
      }
    },
    caixaID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'caixas',
        key: 'id'
      }
    },
    estoqueStatus: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    valor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: true
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
        name: "fk_produtos_caixa_idx",
        using: "BTREE",
        fields: [
          { name: "caixaID" },
        ]
      },
      {
        name: "fk_produtos_subcategoria_idx",
        using: "BTREE",
        fields: [
          { name: "subcategoriaID" },
        ]
      },
    ]
  });
};
