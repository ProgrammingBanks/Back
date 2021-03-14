var express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');


const {clientTB}= require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


var router = express.Router();

// 로그인 
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.reason);
      }
      return req.login(user, async (loginErr) => {
        if (loginErr) {
          console.error(loginErr);
          return next(loginErr);
        }
        const fullUserWithoutPassword = await clientTB.findOne({
          where: { id: user.id },
          attributes: {
            exclude: ['password']
          },
          include: [{
            model: Post,
            attributes: ['id'],
          }, {
            model: clientTB,
            as: 'familly',
            attributes: ['id'],
          }, {
            model: clientTB,
            as: 'friend',
            attributes: ['id'],
          }]
        })
        return res.status(200).json(fullUserWithoutPassword);
      });
    })(req, res, next);
  });
  
  router.post('/', isNotLoggedIn, async (req, res, next) => { // POST /user/
    try {
      const exUser = await clientTB.findOne({
        where: {
          email: req.body.email,
        }
      });
      if (exUser) {
        return res.status(403).send('이미 사용 중인 아이디입니다.');
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      await clientTB.create({
        email: req.body.email,
        nickname: req.body.nickname,
        password: hashedPassword,
      });
      res.status(201).send('ok');
    } catch (error) {
      console.error(error);
      next(error); // status 500
    }
  });
  
  router.post('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
  });

module.exports = router;
