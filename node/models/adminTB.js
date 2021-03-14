const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('adminTB', {
    asn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nsc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    adminName: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    adminEmail: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    adminPw: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    adminTel: {
      type: DataTypes.CHAR(11),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'adminTB',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "asn" },
        ]
      },
    ]
  });
};
