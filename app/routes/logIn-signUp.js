var express = require('express');
var router = express.Router();

router.get("/logIn-register", function(req, res){
    res.sendFile("C:/KEA/Semester 04/Nodejs/Website_w-boostrap/app/public/html/logIn-signUp.html");
});

module.exports = router;