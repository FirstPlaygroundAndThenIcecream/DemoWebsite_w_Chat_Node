//express
var express = require('express');
var app = express();
var router = express.Router();

//mongodb
const mongo = require("mongodb").MongoClient;
const path = "mongodb://localhost:27017/node1";


//body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


router.post("/delete-chat", function(req, res){
    mongo.connect(path, function(err, db){
        if(err){
            console.log("db connect err", err)
        }

        let collection = db.collection("chat_history");
        collection.deleteMany({}, function(err, result) {
            if(err) {
                console.log(err);
            }else{
                console.log("chat history deleted");
            }
        });
        db.close();
    });
    let response = {"status": 200};
    res.json(response);
});

module.exports = router;