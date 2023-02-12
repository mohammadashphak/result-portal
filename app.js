// import modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// env configuration
dotenv.config();

// import routes
const auth = require("./routes/auth");
const uploadFile = require("./routes/uploadFile");
const result = require("./routes/result");
const db = require("./db/db");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

// use routes
app.use("/", auth);
app.use("/", uploadFile);
app.use("/", result);

// Home Page
app.get("/", (req, res) => {
    res.render("index");
});

const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

// Take any port number of your choice which is not taken by any other process
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
