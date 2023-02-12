const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const express = require("express");
const { resultTwelfthSchema, resultTenthSchema } = require("../model/schema");

const router = express.Router();

// Sample File Download
router.post("/sample", (req, res) => {
    sample = req.body.sample;
    if (sample == "Class 12th") {
        res.download("./sample/12th.xlsx");
    }
    if (sample == "Class 10th") {
        res.download("./sample/10th.xlsx");
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "");
    },
    filename: function (req, file, cb) {
        cb(null, `mag.xlsx`); //Appending extension
    },
});

var upload = multer({ storage: storage }).single("result-file");

// Upload file to server
router.post("/uploadFile", upload, async function (req, res) {
    classno = req.body.classno;
    year = req.body.year;
    let workbook = xlsx.readFile(`./mag.xlsx`);
    let worksheet = workbook.Sheets["Sheet1"];
    let data = xlsx.utils.sheet_to_json(worksheet);

    if (classno == 12) {
        data = await data.map((record) => {
            record.AttNo = record[`Att. No.`];
            delete record[`Att. No.`];
            record.RollNo = record[`Roll No.`];
            delete record[`Roll No.`];
            record.FatherName = record[`Father Name`];
            delete record[`Father Name`];
            record.Maths_Bio = record[`Maths/Bio`];
            delete record[`Maths/Bio`];
            return record;
        });
        const Result = mongoose.model(
            `${classno}_${year}`,
            resultTwelfthSchema
        );

        try {
            await Result.deleteMany({ AttNo: { $gte: 1 } });
        } catch (error) {
            res.send(error); // Failure
        }

        try {
            result = await Result.collection.insertMany(data);
            res.render("success");
        } catch (error) {
            return res.send(error);
        }
    } else if (classno == 10) {
        data = await data.map((record) => {
            record.AttNo = record[`Att. No.`];
            delete record[`Att. No.`];
            record.RollNo = record[`Roll No.`];
            delete record[`Roll No.`];
            record.FatherName = record[`Father Name`];
            delete record[`Father Name`];
            record.SocScience = record[`Soc. Science`];
            delete record[`Soc. Science`];
            return record;
        });

        const Result = mongoose.model(`${classno}_${year}`, resultTenthSchema);

        try {
            await Result.deleteMany({ AttNo: { $gte: 1 } });
        } catch (error) {
            res.send(error); // Failure
        }

        try {
            result = await Result.collection.insertMany(data);
            res.render("success");
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
});

module.exports = router;
