var user;
$(document).ready(function(){
    $.get("/get-username", function(data) {
        user = {"userName": data.userName};
    }); 
})

$("#updateInfoBtn").click(function(event){
    event.preventDefault();

    var userName = $.trim($("#userName").val());
    var userPsw = $.trim($("#userPsw").val());
    
    if( userName != "" && userPsw != ""){
        var userInfo = {
            "userName": userName,
            "userPsw": userPsw,
        };
    
        console.log("client side", userInfo);
    
        $.ajax({
            type: "post",
            url: "update-user",
            data: userInfo
        }).done(function(res){
            if(res.status == 200){
                console.log(res.status);
                user.userName = $.trim($("#userName").val());
                $("#userName").val("");
                $("#userPsw").val("");
                alert("Your user information has been updated");
            }
        });       
     }else if(userName == ""){
        $("#nameHelp").text("Enter new username").css({"color":"#b36b00"});
    }else if(userPsw == ""){
        $("#pswHelp").text("Enter new password").css({"color":"#b36b00"});
    }
});

$("#backBtn").click(function(){
    window.location.assign("./chatRoom.html");
});

$("#deleteUserInfoBtn").click(function() {
    $.ajax({
        type: "delete",
        url: "delete-user",
        data: user
    }).done(function(res) {
        if(res.status == 200){
            window.location.assign("./logIn-signUp.html");
            alert("Your account has been deleted");
        }
    });
});

$("#logoutBtn").click(function() {
    window.location.assign("../logIn-signUp.html");
});

