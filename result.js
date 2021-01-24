const xlsx = require('xlsx');

result = (req, res) => {
    rlno = req.body.rlno;
    classno = req.body.classno;
    year = req.body.year;
    if (classno == 12) {
        let wb = xlsx.readFile(`uploads/${classno}_${year}.xlsx`)
        let ws = wb.Sheets['Sheet1'];
        let data = xlsx.utils.sheet_to_json(ws);
        for (let i = 0; i < data.length; i++) {
            if (data[i][`Roll No.`] == rlno) {
                res.status(200).render('result12', {
                    rlno: data[i]['Roll No.'],
                    name: data[i]['Name'],
                    hin: data[i]['Hindi'],
                    eng: data[i]['English'],
                    phy: data[i]['Physics'],
                    chem: data[i]['Chemistry'],
                    math_bio: data[i]['Maths/Bio'],
                    total: data[i]['Total'],
                    prcntg: `${(data[i]['Percentage'] * 100).toFixed(2)}%`,
                });
            }
            else if ((i == data.length - 1) && (data[i][`Roll No.`] != rlno)) {
                res.send('Enter a valid Roll Number');
            }
        }
    }

    else if (classno == 10) {
        let wb = xlsx.readFile(`uploads/${classno}_${year}.xlsx`)
        let ws = wb.Sheets['Sheet1'];
        let data = xlsx.utils.sheet_to_json(ws);
        for (let i = 0; i < data.length; i++) {
            if (data[i][`Roll No.`] == rlno) {
                res.status(200).render('result10', {
                    rlno: data[i]['Roll No.'],
                    name: data[i]['Name'],
                    hin: data[i]['Hindi'],
                    eng: data[i]['English'],
                    sci: data[i]['Science'],
                    sst: data[i]['Soc. Science'],
                    maths: data[i]['Maths'],
                    snskrt: data[i]['Sanskrit'],
                    total: data[i]['Total'],
                    prcntg: `${(data[i]['Percentage'] * 100).toFixed(2)}%`,
                });
            }
            else if ((i == data.length - 1) && (data[i][`Roll No.`] != rlno)) {
                res.send('Enter a valid Roll Number');
            }
        }
    }
    else {
        res.send("Enter a valid Roll Number, Class or Year")
    }
};

module.exports = { result }