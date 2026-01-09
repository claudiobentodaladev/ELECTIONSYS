import { Router } from "express";
import { validator } from "../../utils/middlewares.mjs";
import { createElection } from "../../validator/validator.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { buildDate, formatDate } from "../../utils/data.mjs";

const router = Router();

router.post("/", createElection, validator, (request, response) => {
    const { user } = request;
    const { theme_id, start_at, end_at } = request.body;

    const startDate = buildDate(start_at);
    const endDate = buildDate(end_at);

    if (startDate > endDate) {
        return response.status(400).json({
            message: "Start date cannot be after end date"
        });
    }

    mysql.execute(
        "SELECT * FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(200).json({ created: false, message: "election not created!" })

            mysql.execute(
                "INSERT INTO elections VALUES (default,?,?,?,?,default)",
                [theme_id, formatDate(startDate), formatDate(endDate)], (err, result) => {
                    if (err) return response.status(500).json({ message: "run into a problem", created: false, error: err });
                    const election_id = result.insertId;
                    mysql.execute(
                        "INSERT INTO audit_logs VALUES (default,?,?,?,null,default)",
                        [user.id, "ELECTION_CREATED", election_id], (err, result) => {
                            return response.status(201).json({ message: "election created", created: true, election_id: election_id });
                        }
                    )
                }
            );
        }
    )

});

export default router;