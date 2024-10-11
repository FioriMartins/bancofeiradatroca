const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cliente', {
    idcliente: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    turmaid: {
      type: DataTypes.STRING(11),
      allowNull: false,
      references: {
        model: 'turma',
        key: 'idturma'
      }
    }
  }, {
    sequelize,
    tableName: 'cliente',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idcliente" },
        ]
      },
      {
        name: "fk_turma_cliente_idx",
        using: "BTREE",
        fields: [
          { name: "turmaid" },
        ]
      },
    ]
  });
};
