const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hmLogTB', {
    hsn: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    macAddr: {
      type: DataTypes.STRING(17),
      allowNull: false,
      references: {
        model: 'hmSnrTB',
        key: 'macAddr'
      }
    },
    hm: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    hmTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'hmLogTB',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "hsn" },
        ]
      },
      {
        name: "fk_hmLogTB_hmSnrTB1_idx",
        using: "BTREE",
        fields: [
          { name: "macAddr" },
        ]
      },
    ]
  });
};
