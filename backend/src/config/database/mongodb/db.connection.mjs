import { connect } from "mongoose";

const connectDatabase = async () => {
    try {
        await connect(process.env.MONGODB_URI || "mongodb://localhost/electionSys");
        console.log("Connected to database");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};

connectDatabase();