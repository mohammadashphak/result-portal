const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const express = require('express');
const { resultTwelfthSchema, resultTenthSchema } = require('./schema');

const router = express.Router();

// var upload = multer({ dest: "Upload_folder_name" }) 
// If you do not want to use diskStorage then uncomment it 

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
 // Upload_folder_name 
 cb(null, "");
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

// Upload file to server
router.post("/uploadFile", function (req, res, next) {
    // Error MiddleWare for multer file upload, so if any 
    // error occurs, the image would not be uploaded! 
    upload(req, res, async function (err) {

        if (err) {

            // ERROR occured (here it can be occured due 
            // to uploading image of size greater than 
            // 1MB or uploading different file type) 
            res.send(err);
        }
        else {
            classno = req.body.classno;
            year = req.body.year;
            let workbook = xlsx.readFile(`mag.xlsx`);
            let worksheet = workbook.Sheets['Sheet1'];
            let data = xlsx.utils.sheet_to_json(worksheet);

            if (classno == 12) {
                data = await data.map((record) => {
                    record.AttNo = record[`Att. No.`];
                    delete record[`Att. No.`];
                    record.RollNo = record[`Roll No.`];
                    delete record[`Roll No.`];
                    record.Maths_Bio = record[`Maths/Bio`];
                    delete record[`Maths/Bio`];
                    return record;
                });
        
                const Result = mongoose.model(`${classno}_${year}`, resultTwelfthSchema);
        
                try {
                    await Result.deleteMany({ AttNo: { $gte: 1 } })
                } catch (error) {
                    res.send(error); // Failure
                }

                try {
                    result = await Result.collection.insertMany(data);
                    res.send("Success, File uploaded!");
                } catch (error) {
                    return res.send(error);
                }
            }
            else if (classno == 10) {
                data = await data.map((record) => {
                    record.AttNo = record[`Att. No.`];
                    delete record[`Att. No.`];
                    record.RollNo = record[`Roll No.`];
                    delete record[`Roll No.`];
                    record.SocScience = record[`Soc. Science`];
                    delete record[`Soc. Science`];
                    return record;
                });
        
                const Result = mongoose.model(`${classno}_${year}`, resultTenthSchema);
        
                try {
                    await Result.deleteMany({ AttNo: { $gte: 1 } })
                } catch (error) {
                    res.send(error); // Failure
                }

                try {
                    result = await Result.collection.insertMany(data);
                    res.send("Success, File uploaded!");
                } catch (error) {
                    return res.send(error);
                }
            }
            
       // Delete File
       try {
        fs.unlinkSync(`./mag.xlsx`);
        //file removed
    } catch (error) {
        res.send(error);
    }     
        }
    });
});

module.exports = router