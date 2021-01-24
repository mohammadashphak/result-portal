const multer = require('multer');
const path = require('path');
const fs = require('fs');

// var upload = multer({ dest: "Upload_folder_name" }) 
// If you do not want to use diskStorage then uncomment it 


var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        // Uploads is the Upload_folder_name 
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `mag.xlsx`);
    }
});

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
uploadFile = (req, res, next) => {

    // Error MiddleWare for multer file upload, so if any 
    // error occurs, the image would not be uploaded! 
    upload(req, res, function (err) {

        if (err) {

            // ERROR occured (here it can be occured due 
            // to uploading image of size greater than 
            // 1MB or uploading different file type) 
            res.send(err);
        }
        else {

            // SUCCESS, image successfully uploaded 
            res.send("Success, File uploaded!");
            classno = req.body.classno;
            year = req.body.year;
            fs.rename("uploads/mag.xlsx", `uploads/${classno}_${year}.xlsx`, () => {
            });
        }
    });

};

module.exports = { uploadFile }