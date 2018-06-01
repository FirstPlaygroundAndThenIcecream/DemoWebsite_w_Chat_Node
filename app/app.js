var express = require('express');
var app = express();

var reload = require('reload');

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
const server = require("http").Server(app);
const io = require("socket.io")(server);

//files
var fs = require('fs');


app.use(express.static(__dirname + "/public"));

app.use(require('./routes/index'));
app.use(require('./routes/contact'));
app.use(require('./routes/logIn-signUp'));
app.use(require('./routes/signUp'));
app.use(require('./routes/logIn'));

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


server.listen(3000, function() {
    console.log("Server is listening on port 3000");
});

// var server = app.listen(3000, function(err){
//     if(err){
//         console.log("Can't listen to port 3000", err)
//     }else{
//         console.log("Listening to port 3000");
//     }
// })

reload(app);
