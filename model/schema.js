const mongoose = require("mongoose");
const db = require("../db/db");

const resultTwelfthSchema = new mongoose.Schema({
    AttNo: Number,
    RollNo: Number,
    Name: String,
    FatherName: String,
    Hindi: String,
    English: String,
    Physics: String,
    Chemistry: String,
    Maths_Bio: String,
    Total: String,
    Percentage: String,
});

const resultTenthSchema = new mongoose.Schema({
    AttNo: Number,
    RollNo: Number,
    Name: String,
    FatherName: String,
    Hindi: String,
    English: String,
    Science: String,
    SocScience: String,
    Maths: String,
    Sanskrit: String,
    Total: String,
    Percentage: String,
});

module.exports = { resultTwelfthSchema, resultTenthSchema };
