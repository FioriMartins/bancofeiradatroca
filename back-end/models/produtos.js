const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('produtos', {
    id: {
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
    turmaId: {
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: 'turmas',
        key: 'id'
      }
    },
    vendido: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    valor: {
      type: DataTypes.INTEGER,
      allowNull: false
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
        name: "fk_produtos_turma_idx",
        using: "BTREE",
        fields: [
          { name: "turmaId" },
        ]
      },
    ]
  });
};
