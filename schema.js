const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

mongoose.connect('mongodb://localhost/resultCollection', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

const resultTwelfthSchema = new mongoose.Schema({
    AttNo: Number,
    RollNo: Number,
    Name: String,
    Hindi: String,
    English: String,
    Physics: String,
    Chemistry: String,
    Maths_Bio: String,
    Total: String,
    Percentage: String
});

const resultTenthSchema = new mongoose.Schema({
    AttNo: Number,
    RollNo: Number,
    Name: String,
    Hindi: String,
    English: String,
    Science: String,
    SocScience: String,
    Maths: String,
    Sanskrit: String,
    Total: String,
    Percentage: String
});

module.exports = { resultTwelfthSchema, resultTenthSchema }