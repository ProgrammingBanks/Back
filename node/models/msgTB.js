const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('msgTB', {
    msn: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    asn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'adminTB',
        key: 'asn'
      }
    },
    csn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientTB',
        key: 'csn'
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'msgTB',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "msn" },
        ]
      },
      {
        name: "fk_msgTB_adminTB1_idx",
        using: "BTREE",
        fields: [
          { name: "asn" },
        ]
      },
      {
        name: "fk_msgTB_clientTB1_idx",
        using: "BTREE",
        fields: [
          { name: "csn" },
        ]
      },
    ]
  });
};
