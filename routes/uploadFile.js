const express = require("express");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const { readSheet } = require("read-excel-file/node");
const { resultTwelfthSchema, resultTenthSchema } = require("../model/schema");

const router = express.Router();

const RESULT_CONFIG = {
    12: {
        schema: resultTwelfthSchema,
        columns: {
            "Att. No.": "AttNo",
            "Roll No.": "RollNo",
            "Father Name": "FatherName",
            "Maths/Bio": "Maths_Bio",
        },
    },
    10: {
        schema: resultTenthSchema,
        columns: {
            "Att. No.": "AttNo",
            "Roll No.": "RollNo",
            "Father Name": "FatherName",
            "Soc. Science": "SocScience",
        },
    },
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() !== ".xlsx") {
            return cb(new Error("Only .xlsx files are supported."));
        }
        cb(null, true);
    },
}).single("result-file");

// Convert the rows returned by read-excel-file into objects keyed by the
// header row, matching the old xlsx `sheet_to_json` behaviour.
function rowsToRecords(rows) {
    const [headerRow, ...dataRows] = rows;
    if (!headerRow) return [];

    const headers = headerRow.map((header) => {
        if (header === null || header === undefined) return null;
        const name = String(header).trim();
        return name === "" ? null : name;
    });

    return dataRows
        .filter((row) =>
            row.some((cell) => cell !== null && cell !== undefined && cell !== "")
        )
        .map((row) => {
            const record = {};
            headers.forEach((header, index) => {
                if (header !== null) {
                    record[header] = row[index] ?? null;
                }
            });
            return record;
        });
}

function renameColumns(records, columns) {
    return records.map((record) => {
        const normalized = { ...record };
        for (const [source, target] of Object.entries(columns)) {
            normalized[target] = normalized[source];
            delete normalized[source];
        }
        return normalized;
    });
}

// Sample File Download
router.post("/sample", (req, res) => {
    const sampleFiles = {
        "Class 12th": "12th.xlsx",
        "Class 10th": "10th.xlsx",
    };
    const fileName = sampleFiles[req.body.sample];

    if (!fileName) {
        return res.status(400).send("Unknown sample file.");
    }

    res.download(path.join(__dirname, "..", "sample", fileName));
});

// Upload file to server
router.post("/uploadFile", (req, res) => {
    upload(req, res, async (uploadError) => {
        if (uploadError) {
            return res
                .status(400)
                .send(uploadError.message || "File upload failed.");
        }

        const classno = String(req.body.classno || "");
        const year = String(req.body.year || "");
        const config = RESULT_CONFIG[classno];

        if (!config) {
            return res.status(400).send("Please select a valid class.");
        }
        if (!/^\d{4}$/.test(year)) {
            return res.status(400).send("Please select a valid year.");
        }
        if (!req.file) {
            return res
                .status(400)
                .send("Please choose an .xlsx file to upload.");
        }

        let records;
        try {
            const rows = await readSheet(req.file.buffer);
            records = renameColumns(rowsToRecords(rows), config.columns);
        } catch (error) {
            console.error("Failed to read uploaded Excel file:", error);
            return res
                .status(400)
                .send(
                    "Could not read the uploaded file. Please upload a valid .xlsx file."
                );
        }

        if (records.length === 0) {
            return res
                .status(400)
                .send("The uploaded file does not contain any result rows.");
        }

        try {
            const modelName = `${classno}_${year}`;
            const Result =
                mongoose.models[modelName] ||
                mongoose.model(modelName, config.schema);

            // Replace the previous result set for this class and year.
            await Result.deleteMany({});
            await Result.insertMany(records);

            res.render("success");
        } catch (error) {
            console.error("Failed to import results:", error);
            res.status(500).send(
                "Could not import the uploaded results. Please check the file and try again."
            );
        }
    });
});

module.exports = router;
