var express = require('express');
var router = express.Router();

router.get("/contact", function(req, res){
    res.sendFile("C:/KEA/Semester 04/Nodejs/Website_w-boostrap/app/public/html/contact.html");
});

module.exports = router;