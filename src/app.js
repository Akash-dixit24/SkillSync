const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser())

const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);

connectDB()
    .then(() => {
        console.log("Database is connected...");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((err) => {
        console.log("Database connection failed", err);
    });
