const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hmSnrTB', {
    macAddr: {
      type: DataTypes.STRING(17),
      allowNull: false,
      primaryKey: true
    },
    fsn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'farmTB',
        key: 'fsn'
      }
    }
  }, {
    sequelize,
    tableName: 'hmSnrTB',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "macAddr" },
        ]
      },
      {
        name: "fk_hmSnrTB_farmTB1_idx",
        using: "BTREE",
        fields: [
          { name: "fsn" },
        ]
      },
    ]
  });
};
