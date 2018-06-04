var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
    res.sendFile("C:/KEA/Semester 04/Nodejs/Website_w-boostrap/app/public/html/index.html");
});

module.exports = router;