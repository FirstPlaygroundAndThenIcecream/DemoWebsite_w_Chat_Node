$("#signUpBtn").click(function(event){
    event.preventDefault();

    var userName = $.trim($("#userName").val());
    var userPsw = $.trim($("#userPsw").val());
    var userEmail = $.trim($("#userEmail").val());

    if(userName != "" && userPsw != "" && userEmail != ""){
        var userInfo = {
            "userName": userName,
            "userPsw": userPsw,
            "userEmail": userEmail
        };
    
        console.log("client side", userInfo);
    
        $.ajax({
            type: "post",
            url: "register-user",
            data: userInfo
        }).done(function(res){
            if(res.status == 200){
                console.log(res.status);
                $("#userName").val("");
                $("#userPsw").val("");
                $("#userEmail").val("");
                setTimeout(function(){
                    alert("You are now registered, please log in to use our service");
                }, 300);
            } else if(res.status == 404){
                console.log(res.answer);
            }
        });    
    }else if(userName == ""){
        $("#nameHelp").text("You will need a name").css({"color":"#b36b00"});
    }else if(userPsw == ""){
        $("#pswHelp").text("This is a must").css({"color":"#b36b00"});
    }else if(userEmail == ""){
        $("#emailHelp").text("Please give your email").css({"color":"#b36b00"});
    }
});

$("#logInBtn").click(function(event){
    event.preventDefault();
    var userName = $.trim($("#userName").val());
    var userPsw = $.trim($("#userPsw").val());
 //   var userEmail = $.trim($("#userEmail").val());
    
    if( userName != "" && userPsw != ""){
        var userInfo = {
            "userName": userName,
            "userPsw": userPsw,
//            "userEmail": userEmail
        };
    
        console.log("client side", userInfo);
    
        $.ajax({
            type: "post",
            url: "verify-user",
            data: userInfo
        }).done(function(res){
            if(res.status == 200){
                console.log(res.status);
                window.location.assign("../html/chatroom.html");
                $("#userName").val("");
                $("#userPsw").val("");
    
            } else if(res.status == 404){
                alert("Wrong user name or password, try again");
            }
        });       
     }else if(userName == ""){
        $("#nameHelp").text("Forget your user name?").css({"color":"#b36b00"});
    }else if(userPsw == ""){
        $("#pswHelp").text("Wrong password").css({"color":"#b36b00"});
    }
});