const express = require('express');
const mongoose = require('mongoose');
const { resultTwelfthSchema, resultTenthSchema } = require('./schema');

    const router = express.Router();

    // Result
router.post('/result', async (req, res) => {
        RollNo = req.body.RollNo;
        RollNo = parseInt(RollNo)
        classno = req.body.classno;
        year = req.body.year;

    if (classno == 12) {
        const Result = await mongoose.model(`${classno}_${year}`, resultTwelfthSchema);

        try {
            const result = await Result.collection.findOne({ RollNo: RollNo })
            // console.log(result);
            if (!result) {
                res.render('error')
            }
        else{
        res.render('result12', {
            RollNo: doc[0]['RollNo'],
            Name: doc[0]['Name'],
            Hindi: doc[0]['Hindi'],
            English: doc[0]['English'],
            Physics: doc[0]['Physics'],
            Chemistry: doc[0]['Chemistry'],
            Maths_Bio: doc[0]['Maths_Bio'],
            Total: doc[0]['Total'],
            Percentage: `${(doc[0]['Percentage'] * 100).toFixed(2)}%`,
        });
            }
        } catch (error) {
            res.status(404).send(error)
        }
    }
    else if (classno == 10) {
        const Result = await mongoose.model(`${classno}_${year}`, resultTenththSchema);

        try {
            const result = await Result.collection.findOne({ RollNo: RollNo })
            if (!result) {
                res.render('error')
            }
            else {
                res.render('result10', {
                    RollNo: doc[0]['RollNo'],
                    Name: doc[0]['Name'],
                    Hindi: doc[0]['Hindi'],
                    English: doc[0]['English'],
                    Science: doc[0]['Science'],
                    SocScience: doc[0]['SocScience'],
                    Maths: doc[0]['Maths'],
                    Sanskrit: doc[0]['Sanskrit'],
                    Total: doc[0]['Total'],
                    Percentage: `${(doc[0]['Percentage'] * 100).toFixed(2)}%`,
                });
            }
        }catch (error) {
            res.status(404).send(error)
        }
    }
    else {
        res.send("Enter a valid Roll Number, Class or Year")
    }
});

module.exports = router