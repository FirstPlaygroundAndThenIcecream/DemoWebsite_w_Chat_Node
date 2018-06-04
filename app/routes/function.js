//bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 8;


var encryptUser = function(userInfo){
    bcrypt.hash(userInfo.userPsw, saltRounds, function(err, hash){
        let userHashed = {
            userName: updatedUserInfo.userName,
            userPsw: hash
        }
    });
    return userHashed;
}

module.exports.encryptUser = encryptUser;