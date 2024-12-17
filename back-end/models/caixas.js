const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('caixas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    produtosCaixa: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    turmaID: {
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: 'turmas',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'caixas',
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
        name: "fk_caixas_turmas1_idx",
        using: "BTREE",
        fields: [
          { name: "turmaID" },
        ]
      },
    ]
  });
};
