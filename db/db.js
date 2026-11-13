const mongoose = require("mongoose");

async function connectDB() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL is not set");
    }

    await mongoose.connect(databaseUrl);
    console.log("MongoDB connected");
}

module.exports = connectDB;
