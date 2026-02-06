import { connect } from "mongoose";

try {
    await connect(process.env.MONGODB_URI || "mongodb://localhost/electionSys");
    console.log("MONGODB: Connected to database");
} catch (err) {
    console.error("MONGODB: Database connection error:", err);
    process.exit(1);
}