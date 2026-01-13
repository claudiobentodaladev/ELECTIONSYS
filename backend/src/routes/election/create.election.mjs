import { Router } from "express";
import { createElection } from "../../validator/validator.mjs";
import { validator } from "../../utils/middlewares.mjs";
import { isAdmin } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { buildDate, formatDate } from "../../utils/data.mjs";
import { create, found } from "../../utils/response.class.mjs";

const router = Router();

router.post("/:theme_id", createElection, validator, isAdmin, (request, response) => {
    const { user } = request;
    const { theme_id } = request.params;
    const { start_at, end_at } = request.body;

    const startDate = buildDate(start_at);
    const endDate = buildDate(end_at);

    if (startDate > endDate) {
        return response.status(400).json(new create("election").not("start date cannot be after end date"));
    }

    mysql.execute(
        "SELECT * FROM theme WHERE id = ? AND user_id = ?",
        [theme_id, user.id], (err, result) => {
            if (err) return response.status(500).json(new create("election").error())
            if (result.length === 0) return response.status(404).json(new found("theme").not())

            const [{ id }] = result;

            mysql.execute(
                "INSERT INTO elections VALUES (default,?,?,?,default)",
                [id, formatDate(startDate), formatDate(endDate)], (err, result) => {
                    if (err) return response.status(500).json(new create("election").error());

                    const election_id = result.insertId;

                    mysql.execute(
                        "INSERT INTO audit_logs VALUES (default,?,?,?,null,default)",
                        [user.id, "ELECTION_CREATED", election_id], (err, result) => {
                            if (err) return response.status(500).json(new create("audit log").error())
                            return response.status(201).json(new create("election", election_id).ok());
                        }
                    )
                }
            );

        }
    )

});

export default router;