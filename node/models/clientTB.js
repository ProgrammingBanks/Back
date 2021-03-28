const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientTB', {
    csn: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nsc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    clientName: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    clientEmail: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    clientPw: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    clientTel: {
      type: DataTypes.CHAR(11),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'clientTB',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "csn" },
        ]
      },
    ]
  });
};
