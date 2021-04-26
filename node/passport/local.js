const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { clientTB, farmTB, sequelize } = require('../models');
const h = require('../lib/header');
const loginTrn =  sequelize.transaction();

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'clientEmail',
    passwordField: 'clientPw'
  }, async (email, password, done) => {
    try {
      const user = await clientTB.findOne({
          attributes: ['csn', 'nsc', 'clientPw', 'clientName', 'clientEmail'],
          where: { 
            clientEmail: email 
          }});
      /* 입력한 이메일 사용자 정보 없음 */
      if (!user) {
        return done(null, false, { 
          resCode: h.resCode.cltAcc02.noUserData,
          msgType: h.msgType.cltAcc02Res,
          reason: '존재하지 않는 이메일' 
        });
      }
      const result = await bcrypt.compare(password, user.clientPw);
      if (result) {
        /*로그인 횟수 로그인마다 +1*/
        await sequelize.transaction(async (loginTrn) => {
          await clientTB.update({
            nsc: user.nsc + 1
          }, { where: { csn: user.csn }}, 
          { transaction: loginTrn });
          });
        user.nsc ++ ; 

        const farm = await farmTB.findOne({
          attributes: ['farmName','cropName'],
          where: {
            csn: user.csn
          }});

        if(farm === null) {
          return done(null, {
            csn: user.csn,
            nsc: user.nsc,
            clientName: user.clientName,
            clientEmail: user.clientEmail
            });
        } else {
          return done(null, {
            csn: user.csn,
            nsc: user.nsc,
            clientName: user.clientName,
            farmName: farm.farmName,
            cropName: farm.cropName
            });
        }
      }
      return done(null, false, {
        resCode: h.resCode.cltAcc02.wrongPw, 
        msgType: h.msgType.cltAcc02Res,
        reason: '비밀번호가 틀렸습니다'});
        
    } catch (error) {
      console.error(error);
      return done({
        resCode: h.resCode.cltAcc02.unknownErr, 
        msgType: h.msgType.cltAcc02Res,
        reason: '알수없는 오류'});
    }
  }));
};