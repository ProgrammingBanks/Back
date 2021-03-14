const express = require('express'); 
const router = express.Router(); 
const redis = require('redis'); 

/* 세션 저장 예제 */ 

router.get('/test/:value',function(req,res,next){
    req.session.redsess = req.params.value;
    res.send("저장"+req.params.value);
})

router.get('/', function(req, res, next) { 
   if(req.session.redsess){
       res.send("true , "+req.session.redsess);
   }
   else{
    res.send("true , "+req.session.redsess);
   }
});


module.exports = router;