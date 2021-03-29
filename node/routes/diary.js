const express = require('express');
const h = require('../lib/header');
const {diaryTB,sequelize}= require('../models');
const { isLoggedIn} = require('./middlewares');
const {packPayloadRes} =require('../lib/response')
const router = express.Router();


// 클라이언트 관리 다이어리 정보 입력 : cltFarm01
router.post('/', isLoggedIn, async (req, res,next) => {
  
  const regiDairy = await sequelize.transaction();
  try{
    const exDiary = await diaryTB.findOne({
      where:{
        csn: req.user.csn,
        postDate: req.body.postDate,
    }})
    if (exDiary){
      return res.status(403).send('해당날짜에 다이어리 정보있음');
    }
    
    await diaryTB.create({
      csn: req.user.csn,
      title: req.body.title,
      content: req.body.content,
      postDate: req.body.postDate
    })
    await regiDairy.commit();
    
    return packPayloadRes(
      res,
      h.resCode.cltfarm05 .OK,
      h.msgType.cltFarm03Res,
      "다이어리 등록 성공"
    )
  } catch(err){
    await regiDairy.rollback();
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.unknownErr,
      h.msgType.cltFarm01Res,
      "기타 오류"
    )
  }
});

router.get('/:postDate', isLoggedIn, async (req, res, next) => { 
  try {
    const diary = await diaryTB.findOne({
      attributes:['title','content'],
      where:{
        csn: req.user.csn,
        postDate:req.params.postDate
      }
    })
    if (!diary){
      return res.status(404).send('다이어리가 내용이 없습니다');
    }
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.OK,
      h.msgType.cltFarm01Res,
      "다이어리 정보 조회 성공",
      req.user.csn,
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

router.patch('/update/:postDate', isLoggedIn, async (req, res, next) => {
  const updateDiary = await sequelize.transaction();

  try{
    const test = await diaryTB.update({
      title: req.body.title,
      content: req.body.content,
    },{
      where : {
        csn: req.user.csn,
        postDate:req.params.postDate
      }
    },{transaction: updateDiary})
    console.log(test)
    if(test[0]==0){
      res.send("변경할거없음")
    } 
    else{
      updateDiary.commit();
      return packPayloadRes(
        res,
        h.resCode.cltfarm05.OK,
        h.msgType.cltFarm05res,
        test,
      )
    }
  }catch(err){
    updateDiary.rollback();
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.unknownErr,
      h.msgType.cltFarm01Res,
      "기타 오류"
    )
  }
})

router.delete('/delete/:postDate', isLoggedIn, async (req, res, next) => {
  const deleteDiary = await sequelize.transaction();

  try{
    const remover = await diaryTB.destroy({
      where:{
        csn: req.user.csn,
        postDate:req.params.postDate
      }
    },{transaction: deleteDiary})
    if(!remover){
      res.status(403).send('삭제할 다이어리가 없음')
    }
    else{
      deleteDiary.commit();
      return packPayloadRes(
        res,
        h.resCode.cltfarm05.OK,
        h.msgType.cltFarm05res,
        "다이어리 삭제 성공",
      )
    }
  }catch(err){
    deleteDiary.rollback();
    return packPayloadRes(
      res,
      h.resCode.cltfarm05.unknownErr,
      h.msgType.cltFarm01Res,
      err
    )
  }
})

module.exports = router;