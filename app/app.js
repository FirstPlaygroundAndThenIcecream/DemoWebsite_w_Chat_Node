var express = require('express');
var app = express();

//mongodb
const mongo = require("mongodb").MongoClient;
const path = "mongodb://localhost:27017/node1";

//promise
const promise = require('promise');

//bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 8;
var encryptUser = require("./routes/bcryptfunction");

//emailer
const nodemailer = require("nodemailer");

//body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//get collections from db
let collection_user, collection_chat;
mongo.connect(path, function(err, db){
    if(err) throw err;
    collection_user = db.collection("zooMembers");
    collection_chat = db.collection("chat_history");
});

app.use(express.static(__dirname + "/public"));

//some routes
app.use(require('./routes/index'));
app.use(require('./routes/contact'));
app.use(require('./routes/logIn-signUp'));
app.use(require('./routes/signUp'));
//app.use(require('./routes/deleteChat'));

//compare password to verify user
let profileName = "Anonymous";
app.post("/verify-user", function(req, res){
    let userInfo = req.body;

    collection_user.findOne({"userName": userInfo.userName}, function(err, result){
        if(err){
            console.log("db find user error: ", err);
        }
        else if(result == null){
            console.log("can not find user");
            let response = {"status": 404};
            res.json(response);
        }else{
            var compareResult = encryptUser.comparePsw(userInfo.userPsw, result.userPsw);

            let userPswCompared;

            compareResult.then((comparePsw_result) => 
            {
                userPswCompared = comparePsw_result;
                
                console.log("comparePsw: " + userPswCompared);
                
                if(userPswCompared == true){
                    console.log("right password");
                    let response = {"status": 200};
                    profileName = userInfo.userName;
                    res.json(response);
                }else{
                    let response = {"status": 404};
                    res.json(response);
                    console.log("wrong password");
                }
            }).catch((err) => {
                console.log("promise err");
            });
        }
    });  
});

app.post("/update-user", function(req, res) {
    let updatedUserInfo = req.body;
    console.log(updatedUserInfo);
    updatedUserInfo.userPsw = encryptUser.encryptUser(updatedUserInfo.userPsw);
    
    console.log(updatedUserInfo);

    collection_user.update(
        {"userName": profileName}, 
        {
            $set: {
                "userName": updatedUserInfo.userName,
                "userPsw" : updatedUserInfo.userPsw,
            }
        }
    );
    profileName = updatedUserInfo.userName;
    
    let response = {"status": 200};
    res.json(response);

});

app.get("/get-username", function(req, res) {
    res.json({"userName": profileName});
});

app.delete("/delete-user", function(req, res) {
    var user = req.body;
    collection_user.deleteOne(user, function(err, result){
        if(err){
            console.log(err);
        }
        else{
            console.log("1 record deleted");
        }
    });
    let response = {"status": 200};
    res.json(response);
});

app.delete("/delete-chat", function(req, res){
    collection_chat.deleteMany({}, function(err, result) {
        if(err) {
            console.log(err);
        }else{
            console.log("chat history deleted");
        }
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
            collection_chat.insert(messageData, function(err, success){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(messageData.message + " is added to database");
                }
            });

        console.log("The client wrote: ", messageData.message);

        io.emit("new message", {"message": messageData.message, "username" : messageData.username});          
    });

    socket.on("chat history", function() {
       
        collection_chat.find({}, {_id: 0, message: 1, username: 1}).toArray(function(err, result){
            if(err){
                console.log(err);
            }else{
                console.log(result);
                socket.emit("all chat history", {"result": result});
            }
        });
    });
});

server.listen(4000, function() {
    console.log("Server is listening on port 4000");
});


