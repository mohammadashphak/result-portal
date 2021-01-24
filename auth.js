auth = (req, res, next) => {
    res.render('auth');
    next();
}

uploadPage = (req, res, next) => {
    password = req.body.password;
    if (password == `indian`) {
        res.render('upload');
    }
    else {
        res.send('Enter a valid password!');
    }
    next();
}

module.exports = { auth, uploadPage };