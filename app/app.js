var express = require('express');
var app = express();

//mongodb
const mongo = require("mongodb").MongoClient;
const path = "mongodb://localhost:27017/node1";

//bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 8;

//emailer
const nodemailer = require("nodemailer");

//body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//socket.io
// const server = require("http").Server(app);
// const io = require("socket.io")(server);

// //files
// var fs = require('fs');


app.use(express.static(__dirname + "/public"));

app.use(require('./routes/index'));
app.use(require('./routes/contact'));
app.use(require('./routes/logIn-signUp'));
app.use(require('./routes/signUp'));
//app.use(require('./routes/deleteChat'));

//compare password to verify user
let profileName = "Anonymous";
app.post("/verify-user", function(req, res){
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

app.post("/update-user", function(req, res) {
    let updatedUserInfo = req.body;
    bcrypt.hash(updatedUserInfo.userPsw, saltRounds, function(err, hash){
        let userHashed = {
            userName: updatedUserInfo.userName,
            userPsw: hash
        }
        console.log(userHashed);

        mongo.connect(path, function(err, db) {
            if(err) {
                console.log("db connect error:", err);
            }
            let collection = db.collection("mandatoryII");

            collection.update(
                {"userName": profileName}, 
                {
                    $set: {
                        "userName": userHashed.userName,
                        "userPsw" : userHashed.userPsw,
                    }
                }
            );
            db.close();
            profileName = userHashed.userName;
        })
        
        let response = {"status": 200};
        res.json(response);
    });
});

app.get("/get-username", function(req, res) {
    res.json({"userName": profileName});
});

app.delete("/delete-user", function(req, res) {
    var user = req.body;
    mongo.connect(path, function(err, db){
        if(err){
            console.log("db connect err", err)
        }
   
        let collection = db.collection("mandatoryII");          
        collection.deleteOne(user, function(err, result){
            if(err){
                console.log(err);
            }
            else{
                console.log("1 record deleted");
            }
        });
        db.close();
    });
    let response = {"status": 200};
    res.json(response);
});

app.delete("/delete-chat", function(req, res){
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

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", function(socket) {
    console.log("A client connected");

    socket.username = profileName;

    socket.on("chat message", function(data) {
        let messageData = {"message": data.message, "username": socket.username};
        
        mongo.connect(path, function(err, db){
            if(err){
                console.log("db connect err", err)
            }
       
            let collection = db.collection("chat_history");            
            collection.insert(messageData, function(err, success){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(messageData.message + " is added to database");
                }
            });
            db.close();
        });

        console.log("The client wrote: ", messageData.message);

        io.emit("new message", {"message": messageData.message, "username" : messageData.username});          
    });

    socket.on("chat history", function() {
        mongo.connect(path, function(err, db){
            if(err){
                console.log("db connect err", err);
            }
    
            let collection = db.collection("chat_history");
    
            collection.find({}, {_id: 0, message: 1, username: 1}).toArray(function(err, result){
                if(err){
                    console.log(err);
                }else{
                    console.log(result);
                    socket.emit("all chat history", {"result": result});
                }
            });
            db.close();
        });            
    });
});

server.listen(4000, function() {
    console.log("Server is listening on port 4000");
});

