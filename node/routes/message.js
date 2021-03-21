var express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const h = require('../lib/header');


const {msgTB}= require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


var router = express.Router();

// 메세지 저장
router.post('/message', isLoggedIn, async (req, res, next) => {
   console.log(`SV | DEBUG | cltFarm03 | MESSAGE |${req.session.user}\n`);
  if(req.user === null) {
    return packPayloadRes(
      res, 
      h.resCode.cltAcc04.noUserData,
      h.msgType.cltAcc04Res,
      "메세지 저장 불가능 사용자" )
  } else if(req.session.passport.user.nsc !== req.user.nsc) {
    return packPayloadRes(
      res, 
      h.resCode.cltAcc04.unvaildReq,
      h.msgType.cltAcc04Res,
      "유효하지 않은 접근" )
  }
  const msgTrn = await sequelize.transaction();

  await msgTB.create({
    asn: req.body.nsc,
    csn:  req.body.csn,
    title: req.body.title,
    content : req.content
  }, {transaction: msgTrn});
  await msgTrn.commit();

         return packPayloadRes(
          res, 
          h.resCode.cltFarm04Res,
          h.msgType.cltAcc04Res,
          req.body.csn,
          req.body.nsc
       )
   
  });
// 자기 채팅 목록을 가져옴
  router.get('/message', isLoggedIn, async (req, res, next) => { 

    try {
      console.log(`SV | DEBUG | cltFarm04 | FIND | ${req.user.clientName}\n`);
      /*조회정보 없음 */
      if(!req.user) {
        return packPayloadRes(
          res,
          h.resCode.cltFarm05.noUserData, 
          h.msgType.cltFarm05Res, 
          "없는 사용자의 메세지 정보요청",
          req.body.csn, 
          req.body.nsc);

       /*로그인 횟수 불일치 */
     } else if(req.user.nsc !== req.session.passport.user.nsc) { 
        return packPayloadRes(
          res,
          h.resCode.cltFarm05.unvaildReq, 
          h.msgType.cltFarm05Res, 
          "유효하지 않은 접근",
          req.body.csn, 
          req.body.nsc);
     }
     const messageList = await msgTB.findOne({
      attributes: ['title', 'content'],
      where: {
        csn: req.user.csn
      }});
     /* 조회성공 */
     return packPayloadRes(
        res,
        h.resCode.cltfarm05.OK, 
        
        "사용자 메세지 조회 성공", 
        req.body.csn, 
        req.body.nsc,
        messageList);

} catch(err) {
  return packPayloadRes(
    h.resCode.cltFarm05.unknownErr, 
    h.msgType.cltFarm05Res,
    "기타오류", 
    req.body.csn, 
    req.body.nsc
    );
}});
 
  

module.exports = router;
