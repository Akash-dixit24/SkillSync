const express = require("express");

const app = express();
 
//this will only handle to GET call /user/
app.get("/user" ,(req , res) =>{
       res.send({firstNmae : "AKash" , lastName: "Dixit "})
})


app.post("/user" , (req , res) =>{
       // console.log("save data to datbase");
       //saving data to DB
       res.send("data sucessfully to database")
})



//this will match all the HTTP method API calls to /test
app.use("/test" ,(req ,res )=>{
res.send("hello from the server");
})




 
app.listen(3000 , () =>{
       console.log("server is running port 3000")
});