const crypto = require("crypto");
const express = require("express");

const router = express.Router();

// Authentication
router.get("/auth", (req, res) => {
    res.render("auth");
});

// Upload Page
router.post("/uploadPage", (req, res) => {
    const password = Buffer.from(String(req.body.password || ""));
    const expectedPassword = Buffer.from(String(process.env.PASSWORD || ""));

    const isValid =
        expectedPassword.length > 0 &&
        password.length === expectedPassword.length &&
        crypto.timingSafeEqual(password, expectedPassword);

    if (isValid) {
        // If the password is correct, render the 'upload' view
        return res.render("upload");
    }

    // If the password is incorrect, send a message "Enter a valid password!"
    res.status(401).send("Enter a valid password!");
});

module.exports = router;
