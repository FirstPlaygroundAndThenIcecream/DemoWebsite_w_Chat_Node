var express = require('express');
var router = express.Router();

router.post("/logIn", function(req, res){
    console.log("this is a post");
});

module.exports = router;