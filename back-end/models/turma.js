const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('turma', {
    idturma: {
      type: DataTypes.STRING(11),
      allowNull: false,
      primaryKey: true
    },
    patrono: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'turma',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idturma" },
        ]
      },
    ]
  });
};
