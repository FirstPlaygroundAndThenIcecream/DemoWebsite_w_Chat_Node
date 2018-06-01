var express = require('express');
var app = express();

var reload = require('reload');

app.use(express.static(__dirname + "/public"));

app.use(require('./routes/index'));
app.use(require('./routes/contact'));
app.use(require('./routes/logIn-register'));
app.use(require('./routes/logIn'));

app.locals.title = "web app";

var server = app.listen(3000, function(err){
    if(err){
        console.log("Can't listen to port 3000", err)
    }else{
        console.log("Listening to port 3000");
    }
})

reload(app);
