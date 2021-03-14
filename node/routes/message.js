var express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');


const {msgTB}= require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


var router = express.Router();

// 가져오기, 로그인한 사용자만 
router.post('/message', isLoggedIn, async (req, res, next) => {

        return res.status(200).json("메세지 저장됐어요");
   
  });
// 자기 채팅 목록을 가져옴
  router.get('/message', isLoggedIn, async (req, res, next) => { 

    return res.status(200).json("저장된 메세지 저장됐어요"); 
 });
  

module.exports = router;
