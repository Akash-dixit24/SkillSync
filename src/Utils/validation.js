const validator = require("validator");
const validatioSignUpData = (req) =>{
       const {firstName , lastName , emailId , password} = req.body;

       if(!firstName || !lastName){
              throw new Error("Name is not valid");
       }
       else if(!validator.isEmail(emailId)){
              throw new Error("email id is not valid");
       }
       else if(!validator.isStrongPassword(password)){
              throw new Error("Enter the strong password");
       }
}

module.exports = {
       validatioSignUpData,
}