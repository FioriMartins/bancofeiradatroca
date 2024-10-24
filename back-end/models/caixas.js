const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('caixas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    turma: {
      type: DataTypes.STRING(4),
      allowNull: false,
      references: {
        model: 'turmas',
        key: 'id'
      }
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true
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
        name: "fk_caixas_turmas_idx",
        using: "BTREE",
        fields: [
          { name: "turma" },
        ]
      },
    ]
  });
};
