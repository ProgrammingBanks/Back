var DataTypes = require("sequelize").DataTypes;
var _adminTB = require("./adminTB");
var _camTB = require("./camTB");
var _clientTB = require("./clientTB");
var _diaryTB = require("./diaryTB");
var _farmTB = require("./farmTB");
var _hmLogTB = require("./hmLogTB");
var _hmSnrTB = require("./hmSnrTB");
var _msgTB = require("./msgTB");

function initModels(sequelize) {
  var adminTB = _adminTB(sequelize, DataTypes);
  var camTB = _camTB(sequelize, DataTypes);
  var clientTB = _clientTB(sequelize, DataTypes);
  var diaryTB = _diaryTB(sequelize, DataTypes);
  var farmTB = _farmTB(sequelize, DataTypes);
  var hmLogTB = _hmLogTB(sequelize, DataTypes);
  var hmSnrTB = _hmSnrTB(sequelize, DataTypes);
  var msgTB = _msgTB(sequelize, DataTypes);

  farmTB.belongsTo(adminTB, { as: "asn_adminTB", foreignKey: "asn"});
  adminTB.hasMany(farmTB, { as: "farmtbs", foreignKey: "asn"});
  msgTB.belongsTo(adminTB, { as: "asn_adminTB", foreignKey: "asn"});
  adminTB.hasMany(msgTB, { as: "msgtbs", foreignKey: "asn"});
  diaryTB.belongsTo(clientTB, { as: "csn_clientTB", foreignKey: "csn"});
  clientTB.hasMany(diaryTB, { as: "diarytbs", foreignKey: "csn"});
  farmTB.belongsTo(clientTB, { as: "csn_clientTB", foreignKey: "csn"});
  clientTB.hasMany(farmTB, { as: "farmtbs", foreignKey: "csn"});
  msgTB.belongsTo(clientTB, { as: "csn_clientTB", foreignKey: "csn"});
  clientTB.hasMany(msgTB, { as: "msgtbs", foreignKey: "csn"});
  camTB.belongsTo(farmTB, { as: "fsn_farmTB", foreignKey: "fsn"});
  farmTB.hasMany(camTB, { as: "camtbs", foreignKey: "fsn"});
  hmSnrTB.belongsTo(farmTB, { as: "fsn_farmTB", foreignKey: "fsn"});
  farmTB.hasMany(hmSnrTB, { as: "hmsnrtbs", foreignKey: "fsn"});
  hmLogTB.belongsTo(hmSnrTB, { as: "macAddr_hmSnrTB", foreignKey: "macAddr"});
  hmSnrTB.hasMany(hmLogTB, { as: "hmlogtbs", foreignKey: "macAddr"});

  return {
    adminTB,
    camTB,
    clientTB,
    diaryTB,
    farmTB,
    hmLogTB,
    hmSnrTB,
    msgTB,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
