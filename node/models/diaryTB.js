const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('diaryTB', {
    dsn: {
      autoIncrement: true,
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
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },
    postDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'diaryTB',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "dsn" },
        ]
      },
      {
        name: "fk_DIARY_TB_CLIENT_TB1_idx",
        using: "BTREE",
        fields: [
          { name: "csn" },
        ]
      },
    ]
  });
};
