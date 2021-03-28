const passport = require('passport');
const local = require('./local');
const { clientTB } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, { 
      csn: user.csn,
      nsc: user.nsc
    });
  });

  passport.deserializeUser(async (id, done) => {
    try {
      /*사용자 요청마다 수행 : csn 비교하여 요청 유효 체크 */
      const user = await clientTB.findOne({ 
        attributes: ["csn", "nsc", "clientName", "clientEmail"],
        where: {
          csn: id.csn,
        }});
      /*req.user에 로그인 정보 저장 */
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};