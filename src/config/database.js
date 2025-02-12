const mongoose = require("mongoose");

const connectDB = async () =>{
       await mongoose.connect(
              "mongodb+srv://SkillSync:l6sCxyDG3osXyd9s@namastenode.ux4eh.mongodb.net/DevTinder"
       );
};

module.exports = connectDB;

// connectDB()
//        .then(()=>{
//                console.log("database is connected....");
// })
// .catch((err) =>{
//        console.log("database is not connected")
// });








// l6sCxyDG3osXyd9s
