const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transacoes', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    horario: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    dia: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    comandaId: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    detalhesJson: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'transacoes',
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
    ]
  });
};
