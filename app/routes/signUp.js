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


//new user save to database with hashed password
router.post("/register-user", function(req, res){
    let newUser = req.body;

    bcrypt.hash(newUser.userPsw, saltRounds, function(err, hash){
        let userHashed = {
            userName: newUser.userName,
            userPsw: hash,
            userEmail: newUser.userEmail
        }
        console.log(userHashed);

        let mailOptions = {
            from: 'forTTTTestOnly@mail.com',
            to: userHashed.userEmail,
            subject: 'Thanks for using the blablabla chat!',
            text: 'Dear ' + userHashed.userName + ', thanks for choose using blabla chat, enjoy!',
        };

        mongo.connect(path, function(err, db){
            if(err){
                console.log("db connect err", err)
            }
       
            let collection = db.collection("mandatoryII");            
            collection.insert(userHashed, function(err, success){
                if(err){
                    console.log("db create user error: ", err);
                }
                else{
                    transporter.sendMail(mailOptions, (err, info) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("welcome email is sent");
                        }
                    });
                    console.log(userHashed.userName + " is added to database");
                }
            });
            db.close();
        });
    
        let response = {"status": 200};
 
        res.json(response);
    });
});

module.exports = router;