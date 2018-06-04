var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
    res.sendFile("C:/Users/LeiX/Desktop/Website_NodejsFinal/app/public/html/index.html");
});

module.exports = router;