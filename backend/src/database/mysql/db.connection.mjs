import { createPool as connect } from "mysql2";

export default connect({
    host: "localhost",
    user: "root",
    password: "olamundo",
    database: "electionSys",
    waitForConnections: true
});