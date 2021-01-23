const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const multer = require('multer');
const { report } = require('process');
const { POINT_CONVERSION_HYBRID } = require('constants');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.use('/static', express.static(__dirname + '/static'));

app.use(bodyParser.urlencoded({ extended: false }))

// View Engine Setup 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/result', (req, res) => {
    rlno = req.body.rlno;
    classno = req.body.classno;
    year = req.body.year;
    if (classno == 12) {
        let wb = xlsx.readFile(`uploads/${classno}_${year}.xlsx`)
        let ws = wb.Sheets['Sheet1'];
        let data = xlsx.utils.sheet_to_json(ws);
        for (let i = 0; i < data.length; i++) {
            if (data[i][`Roll No.`] == rlno) {
                res.render('result12', {
                    rlno: data[i]['Roll No.'],
                    name: data[i]['Name'],
                    hin: data[i]['Hindi'],
                    eng: data[i]['English'],
                    phy: data[i]['Physics'],
                    chem: data[i]['Chemistry'],
                    math_bio: data[i]['Maths/Bio'],
                    total: data[i]['Total'],
                    prcntg: `${(data[i]['Percentage'] * 100).toFixed(2)}%`,
                });
            }
            else if ((i == data.length - 1) && (data[i][`Roll No.`] != rlno)) {
                res.send('Enter a valid Roll Number');
            }
        }
    }

    else if (classno == 10) {
        let wb = xlsx.readFile(`uploads/${classno}_${year}.xlsx`)
        let ws = wb.Sheets['Sheet1'];
        let data = xlsx.utils.sheet_to_json(ws);
        for (let i = 0; i < data.length; i++) {
            if (data[i][`Roll No.`] == rlno) {
                res.render('result10', {
                    rlno: data[i]['Roll No.'],
                    name: data[i]['Name'],
                    hin: data[i]['Hindi'],
                    eng: data[i]['English'],
                    sci: data[i]['Science'],
                    sst: data[i]['Soc. Science'],
                    maths: data[i]['Maths'],
                    snskrt: data[i]['Sanskrit'],
                    total: data[i]['Total'],
                    prcntg: `${(data[i]['Percentage'] * 100).toFixed(2)}%`,
                });
            }
            else if ((i == data.length - 1) && (data[i][`Roll No.`] != rlno)) {
                res.send('Enter a valid Roll Number');
            }
        }
    }
    else {
        res.send("Enter a valid Roll Number, Class or Year")
    }
});

app.get('/auth', (req, res) => {
    res.render('auth');
})

// var upload = multer({ dest: "Upload_folder_name" }) 
// If you do not want to use diskStorage then uncomment it 

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        // Uploads is the Upload_folder_name 
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, `mag.xlsx`);
    }
})

// Define the maximum size for uploading 
// picture i.e. 1 MB. it is optional 
// const maxSize = 1 * 1024 * 1024; 

var upload = multer({
    storage: storage,
    // limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb) {

        // Set the filetypes, it is optional 
        var filetypes = /xlsx/;
        // var mimetype = filetypes.test(file.mimetype); 

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

    // 'file' is the name of file attribute 
}).single("file");

app.post("/uploadFile", function (req, res) {
    password = req.body.password;
    if (password == `indian`) {
        res.render("upload");
    }
    else {
        res.send('Enter a valid password!');
    }
})

app.post("/final", function (req, res, next) {

    // Error MiddleWare for multer file upload, so if any 
    // error occurs, the image would not be uploaded! 
    upload(req, res, function (err) {

        if (err) {

            // ERROR occured (here it can be occured due 
            // to uploading image of size greater than 
            // 1MB or uploading different file type) 
            res.send(err)
        }
        else {

            // SUCCESS, image successfully uploaded 
            res.send("Success, File uploaded!")
            classno = req.body.classno;
            year = req.body.year;
            fs.rename("uploads/mag.xlsx", `uploads/${classno}_${year}.xlsx`, () => {
                // console.log(`File renamed`);
            });
        }
    })
})

// Take any port number of your choice which 
// is not taken by any other process 
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});