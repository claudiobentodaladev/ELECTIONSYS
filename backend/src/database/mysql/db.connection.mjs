import { createPool as connect } from "mysql2";

export default connect({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD || "olamundo",
    database: "electionSys",
    waitForConnections: true
});