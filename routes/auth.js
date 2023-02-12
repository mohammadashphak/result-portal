const express = require("express");

const router = express.Router();

// Authentication
router.get("/auth", (req, res) => {
    res.render("auth");
});

// Upload Page
router.post("/uploadPage", (req, res) => {
    password = req.body.password;

    // Check if the entered password is equal to 'indian'
    if (password == process.env.PASSWORD) {
        // If the password is correct, render the 'upload' view
        res.render("upload");
    } else {
        // If the password is incorrect, send a message "Enter a valid password!"
        res.send("Enter a valid password!");
    }
});

module.exports = router;
