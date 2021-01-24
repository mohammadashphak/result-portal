const express = require('express');
// const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
// const xlsx = require('xlsx');
// const multer = require('multer');
const { auth, uploadPage } = require('./auth');
const { uploadFile } = require('./uploadFile');
const { result } = require('./result');

const router = express.Router();
const app = express();

module.exports = app;
const hostname = '127.0.0.1';
const port = 3000;

app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/auth', auth);
app.use('/uploadPage', uploadPage);
app.use('/uploadFile', uploadFile);
app.use('/result', result);

// View Engine Setup 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home Page
app.get('/', (req, res) => {
    res.status(200).render('home');
});

// Authentication
router.get('/auth', auth, (req, res) => { });

// Upload Page
router.post('/uploadPage', uploadPage, (req, res) => { });

// Upload file to server
router.post("/uploadFile", uploadFile, function (req, res, next) { });

// Result
router.post('/result', result, (req, res) => { });

// Take any port number of your choice which is not taken by any other process 
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});