const express = require("express");
const mongoose = require("mongoose");
const { resultTwelfthSchema, resultTenthSchema } = require("../model/schema");

const router = express.Router();

// Result
router.post("/result", async (req, res) => {
    RollNo = req.body.RollNo;
    RollNo = parseInt(RollNo);
    classno = req.body.classno;
    year = req.body.year;

    if (classno == 12) {
        const Result = await mongoose.model(
            `${classno}_${year}`,
            resultTwelfthSchema
        );

        try {
            const result = await Result.collection.findOne({ RollNo: RollNo });
            console.log(
                "🚀 ~ file: result.js:22 ~ router.post ~ result",
                result
            );
            if (!result) {
                res.render("notfound");
            } else {
                res.render("result12", {
                    RollNo: result["RollNo"],
                    Name: result["Name"],
                    FatherName: result["FatherName"],
                    Hindi: result["Hindi"],
                    English: result["English"],
                    Physics: result["Physics"],
                    Chemistry: result["Chemistry"],
                    Maths_Bio: result["Maths_Bio"],
                    Total: result["Total"],
                    Percentage: `${(result["Percentage"] * 100).toFixed(2)}%`,
                });
            }
        } catch (error) {
            res.status(404).send(error);
        }
    } else if (classno == 10) {
        const Result = await mongoose.model(
            `${classno}_${year}`,
            resultTenthSchema
        );

        try {
            const result = await Result.collection.findOne({ RollNo: RollNo });
            if (!result) {
                res.render("notfound");
            } else {
                res.render("result10", {
                    RollNo: result["RollNo"],
                    Name: result["Name"],
                    FatherName: result["FatherName"],
                    Hindi: result["Hindi"],
                    English: result["English"],
                    Science: result["Science"],
                    SocScience: result["SocScience"],
                    Maths: result["Maths"],
                    Sanskrit: result["Sanskrit"],
                    Total: result["Total"],
                    Percentage: `${(result["Percentage"] * 100).toFixed(2)}%`,
                });
            }
        } catch (error) {
            res.status(404).send(error);
        }
    } else {
        res.render("notFound");
    }
});

module.exports = router;
