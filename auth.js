const express = require('express');

const router = express.Router();
// Authentication
router.get('/auth', (req, res) => {
    res.render('auth');
});
// Upload Page
router.post('/uploadPage', (req, res) => {
    password = req.body.password;
    if (password == `indian`) {
        res.render('upload');
    }
    else {
        res.send('Enter a valid password!');
    }
});

module.exports = router;