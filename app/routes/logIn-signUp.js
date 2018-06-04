var express = require('express');
var router = express.Router();

router.get("/logIn-signUp", function(req, res){
    res.sendFile("C:/Users/LeiX/Desktop/Website_NodejsFinal/app/public/logIn-signUp.html");
});

module.exports = router;