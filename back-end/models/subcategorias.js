const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subcategorias', {
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
    valor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantidade: {
      type: DataTypes.INTEGER,
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
    ultimaAtualizacao: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'subcategorias',
    hasTrigger: true,
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
        name: "fk_subcategoria_categoria_idx",
        using: "BTREE",
        fields: [
          { name: "categoriaID" },
        ]
      },
    ]
  });
};
