var socket = io.connect("http://localhost:4000");

$(document).ready(function(){

    $.get("/get-username", function(data) {
        $("#paraUserName").text(data.userName);
    });  

    socket.emit("chat history", function(data){    
    });

    socket.on("all chat history", function(data) {
        console.log(data.result);
        for(var i = 0; i < data.result.length; i++) {
            $("#chatroom").append("<p class='message'><strong>" + data.result[i].username + ":</strong> " + data.result[i].message + "</p>");
        }
    });
});
            
$("#inputMessage").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#btnSend").click();
    }
});

$("#btnSend").click(function() {
    let message = inputMessage.value;
    console.log(message);
    socket.emit("chat message", {"message": message});
    $("#inputMessage").val('');
    $("inputMessage").focus();
});

socket.on("new message", function(data) {
    $("#chatroom").append("<p class='message'><strong>" + data.username + ":</strong> " + data.message + "</p>");
    var d = $('#chatroom');
    d.scrollTop(d.prop("scrollHeight"));
});

$("#updateBtn").click(function(){
    window.location.assign("updateInfo.html");
});

$("#deleteChatBtn").click(function(){
    $.ajax({
        type: "delete",
        url: "delete-chat"
    }).done(function(res){
        $("#chatroom").empty();
    });
});

$("#logoutBtn").click(function() {
    window.location.assign("../logIn-signUp.html");
});