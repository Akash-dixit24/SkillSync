const express = require("express");

const app = express();
 
app.use("/user" ,(req, res ,next )=>{
  //res.send("1st response back")
  console.log("handling the route user");
 next();
}  ,
(req, res)=>{
  res.send("2nd response back")
  console.log("handling the route user");
});  


 
app.listen(3000 , () =>{
       console.log("server is running port 3000")
});