const express = require('express');
const h = require('../lib/header');
const {farmTB,sequelize}= require('../models');
const { isLoggedIn} = require('./middlewares');
const {packPayloadRes} =require('../lib/response')
const router = express.Router();


// 클라이언트 관리 다이어리 정보 입력 : cltFarm01
router.post('/', isLoggedIn, async (req, res,next) => {
  
  const regiFarm = await sequelize.transaction();
  try{
    const exFarm = await farmTB.findOne({
      where:{
        csn: req.user.csn,
    }})
    if (exFarm){
      return res.status(403).send('이미 농장에 가입되어있음');
    }
    
    await farmTB.create({
      asn:1,
      csn: req.user.csn,
      farmAddr: req.body.farmAddr,
      farmName: req.body.farmName,
      cropName: req.body.cropName
    })
    await regiFarm.commit();
    
    return packPayloadRes(
      res,
      h.resCode.cltfarm05 .OK,
      h.msgType.cltFarm03Res,
      "농장 등록 성공"
    )
  } catch(err){
    await regiFarm.rollback();
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.unknownErr,
      h.msgType.cltFarm01Res,
      "기타 오류"
    )
  }
});

router.get('/', isLoggedIn, async (req, res, next) => { 
  try {
    const exfarm = await farmTB.findOne({
      attributes:['farmAddr','farmName'],
      where:{
        csn: req.user.csn,
      }
    })
    if (!exfarm){
      return res.status(404).send('농장 정보가 없습니다');
    }
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.OK,
      h.msgType.cltFarm01Res,
      "농장 정보 조회 성공",
      req.user.csn,
      1,
      exfarm
    )
  }catch(err) {
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.unknownErr,
      h.msgType.cltFarm01Res,
      "기타 오류"
    )
}});

router.patch('/update', isLoggedIn, async (req, res, next) => {
  const updateFarm = await sequelize.transaction();

  try{
    const changer = await farmTB.update({
        farmAddr: req.body.farmAddr,
        farmName: req.body.farmName
    },{
      where : {
        csn: req.user.csn,
      }
    },{transaction: updateFarm})
    if(changer[0]==0){
        return res.status(403).send('변경사항 없음');
    } 
    else{
      updateFarm.commit();
      return packPayloadRes(
        res,
        h.resCode.cltfarm05.OK,
        h.msgType.cltFarm05res,
        {"farmAddr":req.body.farmAddr,"farmName":req.body.farmName},
      )
    }
  }catch(err){
    updateFarm.rollback();
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.unknownErr,
      h.msgType.cltFarm01Res,
      "기타 오류"
    )
  }
})


module.exports = router;