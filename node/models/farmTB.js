const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('farmTB', {
    fsn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    csn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientTB',
        key: 'csn'
      }
    },
    asn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'adminTB',
        key: 'asn'
      }
    },
    farmAddr: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    farmName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cropName: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'farmTB',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fsn" },
        ]
      },
      {
        name: "fk_farmTB_clientTB1_idx",
        using: "BTREE",
        fields: [
          { name: "csn" },
        ]
      },
      {
        name: "fk_farmTB_adminTB1_idx",
        using: "BTREE",
        fields: [
          { name: "asn" },
        ]
      },
    ]
  });
};
