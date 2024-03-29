var express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const {clientTB, sequelize}= require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const h = require('../lib/header');
const {packPayloadRes} =require('../lib/response')

var router = express.Router();

 /*클라이언트 회원가입 요청 : cltAcc01*/
 router.post('/', isNotLoggedIn, async (req, res, next) => { // POST /user/
  const signUpTrn = await sequelize.transaction();
  try { 
    const exUser = await clientTB.findOne({
      where: {
        clientEmail: req.body.clientEmail
      }
    });
    // 식별자 있을 시에 packPayloadRes 함수 사용 
    if (exUser) {
      return packPayloadRes(
        res,
        h.resCode.cltAcc01.existEmail,
        h.msgType.cltAcc01Res,
        "이미 존재하는 이메일"
      );
    }
    /*비밀번호 암호화 -> 사용자 계정 생성 */ 
    const hashedPassword = await bcrypt.hash(req.body.clientPw, 12);
    await clientTB.create({
      clientEmail: req.body.clientEmail,
      clientName: req.body.clientName,
      clientPw: hashedPassword,
      clientTel: req.body.clientTel
    }, {transaction: signUpTrn});

    await signUpTrn.commit();

    /*회원가입 성공 */
    return packPayloadRes(
      res,
      h.resCode.cltAcc01.OK,
      h.msgType.cltAcc01Res,
      "회원가입 성공"
    );

  } catch (error) {
    await signUpTrn.rollback();  
    console.error(error);
    /* 기타오류 */
    return packPayloadRes(
      res,
      h.resCode.cltAcc01.unknownErr,
      h.msgType.cltAcc01Res,
      "기타오류"
    );
  }
});

/* 클라이언트 로그인 요청 :cltAcc02 */ 
router.post('/login', isNotLoggedIn, (req, res, next) => {
   /* 로컬 로그인 전략 수행 */
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return packPayloadRes(
          res,
          h.resCode.cltAcc02.unknownErr,
          h.msgType.cltAcc02Res,
          "기타오류"
        );
      }
      if (info) {
        console.log(`SV | DEBUG | cltAcc02 | STRATEGY ERROR |\n`);
        console.log(info,"\n");
        return res.status(401).send(info);
      }
      return req.login(user, async (loginErr) => {
        /*serialize error */
        if (loginErr) {
          console.log(`SV | DEBUG | cltAcc02 | ERROR |\n`);
          console.error(loginErr);

          return packPayloadRes(
            res,
            h.resCode.cltAcc02.unknownErr,
            h.msgType.cltAcc02Res,
            "기타오류"
          );
        }
        /* send client data : csn, nsc, clientName +etc */
        return packPayloadRes(
          res,
          h.resCode.cltAcc02.OK,
          h.msgType.cltAcc02Res,
          "로그인 성공",
          user.csn,
          user.nsc,
          user.clientName
        );
      });
    })(req, res, next);
  });
  
  
  /*클라이언트 로그아웃 요청: cltAcc03 */
  router.post('/logout', isLoggedIn, (req, res) => {
    console.log(`SV | DEBUG | cltAcc03 | LOGOUT |${req.session.user}\n`);
    if(req.user === null) {
      return packPayloadRes(
        res, 
        h.resCode.cltAcc03.noUserData,
        h.msgType.cltAcc03Res,
        "로그아웃 불가능 사용자" )
    } else if(req.session.passport.user.nsc !== req.user.nsc) {
      return packPayloadRes(
        res, 
        h.resCode.cltAcc03.unvaildReq,
        h.msgType.cltAcc03Res,
        "유효하지 않은 접근" )
    }
    req.logout();
    req.session.destroy();
    return packPayloadRes(
      res,
      h.resCode.cltAcc03.OK,
      h.msgType.cltAcc03Res,
      "로그아웃 성공"
    );
  });

  /*클라이언트 정보 조회: cltAcc04 */
  router.post('/profile', isLoggedIn, async (req, res) => {
      try {
        console.log(`SV | DEBUG | cltAcc04 | FIND | ${req.user.clientName}\n`);
        /*조회정보 없음 */
        if(!req.user) {
          return packPayloadRes(
            res,
            h.resCode.cltAcc04.noUserData, 
            h.msgType.cltAcc04Res, 
            "없는 사용자 정보",
            req.body.csn, 
            req.body.nsc,
            profile);

         /*로그인 횟수 불일치 */
       } else if(req.user.nsc !== req.session.passport.user.nsc) { 
          return packPayloadRes(
            res,
            h.resCode.cltAcc04.unvaildReq, 
            h.msgType.cltAcc04Res, 
            "유효하지 않은 접근",
            req.body.csn, 
            req.body.nsc);
       }
       const profile = await clientTB.findOne({
        attributes: ['clientName', 'clientEmail', 'clientTel'],
        where: {
          csn: req.user.csn
        }});
       /* 조회성공 */
       return packPayloadRes(
          res,
          h.resCode.cltAcc04.OK, 
          h.msgType.cltAcc04Res,
          "사용자 정보 조회 성공", 
          req.body.csn, 
          req.body.nsc,
          profile);

  } catch(err) {
    return packPayloadRes(
      h.resCode.cltAcc04.unknownErr, 
      h.msgType.cltAcc04Res,
      "기타오류", 
      req.body.csn, 
      req.body.nsc
      );
  }});


  /*사용자 정보 업데이트: cltAcc05 */
  router.post('/update', isLoggedIn, async(req, res) => {
    const updateTrn = await sequelize.transaction();
    
    try {
      console.log(`SV | DEBUG | cltAcc05 | UPDATE | ${req.user.clientName}\n`);
      /*업데이터 사용자 정보 없음 */
      if(!req.user) {
        console.log(`SV | DEBUG | cltAcc05 | UPDATE | NO_CLIENT_DATA\n`);
        return packPayloadRes(
          res,
          h.resCode.cltAcc05.noUserData, 
          h.msgType.cltAcc05Res,
          "업데이트 할 수 없는 사용자 정보", 
          req.body.csn, 
          req.body.nsc,
          profile);

      /*로그인 횟수 불일치 */
     } else if(req.session.passport.user.nsc !== req.user.nsc) { 
        console.log(`SV | DEBUG | cltAcc05 | UPDATE | INCORRECT_NSC\n`);
        return packPayloadRes(
          res,
          h.resCode.cltAcc05.unvaildReq, 
          h.msgType.cltAcc05Res,
          "유효하지 않은 접근", 
          req.user.csn, 
          req.session.passport.user.nsc);
     }

    /*비밀번호 변경이 없는 경우 */ 
     if(req.body.clientPw === null ||
        req.body.clientPw === undefined ||
        req.body.clientPw == ' ') {
        console.log(`SV | DEBUG | cltAcc05 | UPDATE | NO_PW_CHANGE\n`);

        clientTB.update({
          nsc: ++ req.session.passport.user.nsc,
          clientName: req.body.clientName,
          clientEmail: req.body.clientEmail,
          clientTel: req.body.clientTel,
        },
        { where: {
            csn: req.user.csn
          } },
        {
          transaction: updateTrn
        });
        updateTrn.commit();
        return packPayloadRes(
          res,
          h.resCode.cltAcc05.OK, 
          h.msgType.cltAcc05Res, 
          "사용자 정보 변경 성공",
          req.user.csn, 
          ++ req.user.nsc 
        );
      }
      /* 비밀번호 변경이 포함되있는 경우 */
     else {
      console.log(`SV | DEBUG | cltAcc05 | UPDATE | WITH_PW_CHANGE\n`);
      /*패스워드 변경 시 패스워드 비교  */
      checkPw = await clientTB.findOne({
        attributes : ["clientPw"],
        where : {
          csn : req.user.csn 
        }
      });
        const hashedPassword = await bcrypt.hash(req.body.newPw, 12);
        const result = await bcrypt.compare(req.body.clientPw, checkPw.clientPw);
        if(result) {
          clientTB.update({
            nsc: ++ req.session.passport.user.nsc,
            clientName: req.body.clientName,
            clientEmail: req.body.clientEmail,
            clientTel: req.body.clientTel,
            clientPw: hashedPassword
          },{
            where: {
              csn: req.user.csn
            } 
          },
          {
            transaction: updateTrn
          });
          updateTrn.commit();
          return packPayloadRes(
            res,
            h.resCode.cltAcc05.OK, 
            h.msgType.cltAcc05Res, 
            "사용자 정보, 비밀번호 변경 성공",
            req.user.csn, 
            ++ req.user.nsc
          );
        /*일치하지 않는 비밀번호 */  
        } else {
          return packPayloadRes(
            res,
            h.resCode.cltAcc05.wrongPw, 
            h.msgType.cltAcc05Res,
            "틀린 비밀번호", 
            req.body.csn, 
            req.body.nsc
          );
        }
      }
  } catch(err) {
      updateTrn.rollback();
      return packPayloadRes(
        res,
        h.resCode.cltAcc05.unknownErr, 
        h.msgType.cltAcc05Res, 
        "기타오류",
        req.body.csn, 
        req.body.nsc
      );
}});

module.exports = router;