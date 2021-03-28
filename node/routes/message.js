var express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const h = require('../lib/header');
const {packPayloadRes} =require('../lib/response')

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
      //본인만 저장 req.user.nsc !== req.session.passport.user.nsc
  } else if(req.session.passport.user.csn !== req.user.csn) {
    return packPayloadRes(
      res, 
      h.resCode.cltAcc04.unvaildReq,
      h.msgType.cltAcc04Res,
      "유효하지 않은 접근" )
  }
  const msgTrn = await sequelize.transaction();

  await msgTB.create({
    asn: req.body.asn,
    csn:  req.user.csn,
    title: req.body.title,
    content : req.body,content
  }, {transaction: msgTrn});
  await msgTrn.commit();

         return packPayloadRes(
          res,
          h.resCode.cltFarm04Res,
          h.msgType.cltFarm04Res,
          "메세지 생성 성공",
          req.user.csn, 
          req.user.nsc 
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
          req.user.csn, 
          req.user.nsc
        )

       /*클라이언트 본인 또는 어드민이 아닌 경우, 유효하지 않은 접근*/
     } else if(req.user.csn !== req.session.passport.user.csn) { 
        return packPayloadRes(
          res,
          h.resCode.cltFarm05.unvaildReq, 
          h.msgType.cltFarm05Res, 
          "유효하지 않은 접근",
          req.user.csn, 
          req.user.nsc)
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
        h.msgType.cltFarm01Res,
        "사용자 메세지 조회 성공", 
        req.user.csn, 
        req.user.nsc,
        messageList
        );

    
} catch(err) {
  return packPayloadRes(
    h.resCode.cltFarm05.unknownErr, 
    h.msgType.cltFarm05Res,
    "기타오류", 
    req.user.csn, 
    req.user.nsc
    );
}});
 
  

module.exports = router;