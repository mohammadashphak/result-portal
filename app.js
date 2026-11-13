// import modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// env configuration
dotenv.config({ quiet: true });

// import routes
const auth = require("./routes/auth");
const uploadFile = require("./routes/uploadFile");
const result = require("./routes/result");
const connectDB = require("./db/db");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// use routes
app.use("/", auth);
app.use("/", uploadFile);
app.use("/", result);

// Home Page
app.get("/", (req, res) => {
    res.render("index");
});

const hostname = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

connectDB().catch((error) => {
    console.error("MongoDB connection failed:", error.message);
});

// Take any port number of your choice which is not taken by any other process
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
