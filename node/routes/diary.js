const express = require('express');
const h = require('../lib/header');
const {diaryTB,sequelize}= require('../models');
const { isLoggedIn} = require('./middlewares');
const {packPayloadRes} =require('../lib/response')
const router = express.Router();


// 클라이언트 관리 다이어리 정보 입력 : cltFarm01
router.post('/:postDate',isLoggedIn, async (req, res,next) => {
  try{
    const exDiary = await diaryTB.findOne({
      where:{
        csn: req.user.csn,
        postDate: req.params.postDate,
    }})
    if (exDiary){
      return res.status(200).send({reason:"해당날짜에 다이어리 정보있음"})
    }

    const regiDairyResult = await sequelize.transaction(async(t)=>{
      const regiDairy = await diaryTB.create({
        csn: req.user.csn,
        title: req.body.diaryTitle,
        content: req.body.diaryContent,
        postDate: req.params.postDate},{transaction:t}
      );
      return regiDairy
    })
    
    return packPayloadRes(
      res,
      h.resCode.cltfarm05 .OK,
      h.msgType.cltFarm03Res,
      "다이어리 등록 성공"
    )
  } catch(err){
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.unknownErr,
      h.msgType.cltFarm01Res,
      "기타 오류"
    )
  }
});

router.get('/:postDate',isLoggedIn ,async (req, res, next) => { 
  try {
    const diary = await diaryTB.findOne({
      attributes:[['title','diaryTitle'],['content','diaryContent']],
      where:{
        csn: req.user.csn,
        postDate:req.params.postDate
      }
    })
    if (!diary){
      return res.status(200).send({reason:'다이어리가 내용이 없습니다'});
    }
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.OK,
      h.msgType.cltFarm01Res,
      "다이어리 정보 조회 성공",
      1,
      1,
      diary
    )
  }catch(err) {
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.unknownErr,
      h.msgType.cltFarm01Res,
      "기타 오류"
    )
}});

router.patch('/update/:postDate',isLoggedIn, async (req, res, next) => {
  try{
    const updateDairyResult = await sequelize.transaction(async(t)=>{
      const updateDairy = await diaryTB.update({
        title: req.body.diaryTitle,
        content: req.body.diaryContent},
        { 
          where : {
            csn: req.user.csn,
            postDate:req.params.postDate
          }
        },{transaction:t}
      ); 
      return updateDairy
    })
    if(updateDairyResult[0]==0){
      res.status(200).send({reason:"변경할거없음"})
    } 
    else{
      return packPayloadRes(
        res,
        h.resCode.cltfarm05.OK,
        h.msgType.cltFarm05res,
        "다이어리 수정 성공"
      )
    }
  }catch(err){
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.unknownErr,
      h.msgType.cltFarm01Res,
      "기타 오류"
    )
  }
})

router.delete('/delete/:postDate', isLoggedIn, async (req, res, next) => {
  try{
    const removeDairyResult = await sequelize.transaction(async(t)=>{
      const removeDairy = await diaryTB.destroy({
        where:{
          csn: req.user.csn,
          postDate: req.params.postDate}
        },{transaction:t}
      );
      return removeDairy
    })

    if(!removeDairyResult){
      res.status(200).send({reason:'삭제할 다이어리가 없음'})
    }
    else{
      return packPayloadRes(
        res,
        h.resCode.cltfarm05.OK,
        h.msgType.cltFarm05res,
        "다이어리 삭제 성공",
      )
    }
  }catch(err){
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.unknownErr,
      h.msgType.cltFarm01Res,
      err
    )
  }
})

module.exports = router;