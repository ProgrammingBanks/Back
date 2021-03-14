const express = require('express'); 
const router = express.Router(); 
const redis = require('redis'); 

const redisClient = redis.createClient({ 
    host : "redis", 
}); 

/* GET home page. */ 
router.get('/', function(req, res, next) { 
    redisClient.set("NAME","kim")
    redisClient.get("NAME" , (err , result) => { 
        res.send(result) 
    }); 
});

module.exports = router;