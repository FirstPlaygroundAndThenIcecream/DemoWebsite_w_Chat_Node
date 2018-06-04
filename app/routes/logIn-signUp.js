var express = require('express');
var router = express.Router();

router.get("/logIn-signUp", function(req, res){
    res.sendFile("C:/KEA/Semester 04/Nodejs/Website_w-boostrap/app/public/logIn-signUp.html");
});

module.exports = router;