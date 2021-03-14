var express = require('express');
var router = express.Router();
const {User}= require('../models');

/* GET home page. */
router.get('/', async(req, res, next)=>{
  try{
    const user = await User.findAll();
    res.send(user)
  }catch(err){
    console.error(error);
    next(error);
  }
})

module.exports = router;
