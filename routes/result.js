const express = require("express");
const mongoose = require("mongoose");
const { resultTwelfthSchema, resultTenthSchema } = require("../model/schema");

const router = express.Router();

const RESULT_CONFIG = {
    12: {
        schema: resultTwelfthSchema,
        view: "result12",
        fields: [
            "RollNo",
            "Name",
            "FatherName",
            "Hindi",
            "English",
            "Physics",
            "Chemistry",
            "Maths_Bio",
            "Total",
        ],
    },
    10: {
        schema: resultTenthSchema,
        view: "result10",
        fields: [
            "RollNo",
            "Name",
            "FatherName",
            "Hindi",
            "English",
            "Science",
            "SocScience",
            "Maths",
            "Sanskrit",
            "Total",
        ],
    },
};

function formatPercentage(value) {
    const percentage = Number(value);
    return Number.isFinite(percentage)
        ? `${(percentage * 100).toFixed(2)}%`
        : "Not available";
}

// Result
router.post("/result", async (req, res) => {
    const classno = String(req.body.classno || "");
    const year = String(req.body.year || "");
    const rollNoInput = String(req.body.RollNo ?? "").trim();
    const RollNo = Number(rollNoInput);
    const config = RESULT_CONFIG[classno];

    if (
        !config ||
        !/^\d{4}$/.test(year) ||
        rollNoInput === "" ||
        !Number.isInteger(RollNo) ||
        RollNo < 0
    ) {
        return res.render("notfound");
    }

    const modelName = `${classno}_${year}`;
    const Result =
        mongoose.models[modelName] ||
        mongoose.model(modelName, config.schema);

    try {
        const result = await Result.findOne({ RollNo }).lean();

        if (!result) {
            return res.render("notfound");
        }

        const viewData = {};
        for (const field of config.fields) {
            viewData[field] = result[field];
        }
        viewData.Percentage = formatPercentage(result.Percentage);

        res.render(config.view, viewData);
    } catch (error) {
        console.error("Failed to fetch result:", error);
        res.status(500).send("Could not fetch the result.");
    }
});

module.exports = router;
