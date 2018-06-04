//express
var express = require('express');
var app = express();
var router = express.Router();

//mongodb
const mongo = require("mongodb").MongoClient;
const path = "mongodb://localhost:27017/node1";

//bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 8;

//emailer
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.com',
    auth: {
        user: 'forTTTTestOnly@mail.com',
        pass: 'Test&1234'
    }
});

//body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let profileName = "Anonymous";
router.post("/verify-user", function(req, res){
    let userInfo = req.body;
    mongo.connect(path, function(err, db){
        if(err){
            console.log("db connect err", err);
        }

        let collection = db.collection("mandatoryII");

        collection.findOne({"userName": userInfo.userName}, function(err, result){
            if(err){
                console.log("db find user error: ", err);
            }
            else if(result == null){
                console.log("can not find user");
                let response = {"status": 404};
                res.json(response);
            }else{
                bcrypt.compare(userInfo.userPsw, result.userPsw, function(error, result){
                    if(error){
                        console.log("db compare hash err", error)
                    } 
                    else{
                        if(result == true){
                            console.log("right password");
                            let response = {"status": 200};
                            profileName = userInfo.userName;
                            res.json(response);
                        }else{
                            console.log("wrong password");
                        }
                    }
                });
            }
        });
        db.close();
    });    
});

module.exports.router = router;
