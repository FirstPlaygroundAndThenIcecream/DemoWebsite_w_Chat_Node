//bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 8;

//promise
const promise = require('promise');

var encryptUser = function(userPsw){
    return new Promise((resolve, reject) =>{
        let hasedPsw;
        bcrypt.hash(userPsw, saltRounds, function(err, result){
            if(err){
                console.log("problems using promise to compare");
                reject(err);
            }
            else{
                hasedPsw = result;        
                resolve(hasedPsw);    
            } 
        });            
    });
}

var comparePsw = function(userPsw, hasedPsw){
    return new Promise((resolve, reject) => {
        let compareResult;

        bcrypt.compare(userPsw, hasedPsw, function(err, result){
            if(err) {
                console.log("problems using promise to compare");
                reject(err);
            }
            else{
                compareResult = result;
                resolve(compareResult);    
            } 
            console.log("com function: " + compareResult + ", " + result);
        }); 
    });
}

module.exports.encryptUser = encryptUser;
module.exports.comparePsw = comparePsw;