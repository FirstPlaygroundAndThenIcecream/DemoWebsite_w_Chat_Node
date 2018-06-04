var express = require('express');
var router = express.Router();

router.get("/contact", function(req, res){
    res.sendFile("C:/Users/LeiX/Desktop/Website_NodejsFinal/app/public/html/contact.html");
});

module.exports = router;