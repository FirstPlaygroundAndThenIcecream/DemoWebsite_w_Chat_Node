//express
var express = require('express');
var app = express();
var router = express.Router();


//mongodb
const mongo = require("mongodb").MongoClient;
const path = "mongodb://localhost:27017/node1";

let collection;
mongo.connect(path, function(err, db){
    if(err){
        console.log("db connect err", err)
    }
    collection = db.collection("zooMembers");

});

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

//function
var encryptUser = require("./bcryptfunction");


//new user save to database with hashed password
router.post("/register-user", function(req, res){
    let newUser = req.body;
    console.log(newUser);

    var hasedPsw = encryptUser.encryptUser(newUser.userPsw);
    
    hasedPsw.then((hasedResult) => {
        console.log(hasedResult);
        newUser.userPsw = hasedResult;   
       
        collection.insert(newUser, function(err, success){
            if(err){
                console.log("db create user error: ", err);
            }
            else{
                console.log(newUser.userName + " is added to database");
            }
        });

        let mailOptions = {
            from: 'forTTTTestOnly@mail.com',
            to: newUser.userEmail,
            subject: 'Thanks for using the blablabla chat!',
            text: 'Dear ' + newUser.userName + ', thanks for choose using blabla chat, enjoy!',
        };

        console.log(newUser.userEmail);
        
        transporter.sendMail(mailOptions, (err, info) => {
            console.log("mail info: " + info);
            if(err) console.log(err);
            else{
                console.log("welcome email is sent");
            }
        });
    
        let response = {"status": 200};
        res.json(response);

    }).catch((err) => {
        console.log("promise err");
    });
});

module.exports = router;