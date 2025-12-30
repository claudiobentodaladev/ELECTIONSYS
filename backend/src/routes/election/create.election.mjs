import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { buildDate, formatDate } from "../../utils/data.mjs";

const router = Router();

router.post("/", (request, response) => {
    const { user } = request;
    const { title, description, start_at, end_at } = request.body;

    const startDate = buildDate(start_at);
    const endDate = buildDate(end_at);

    if (startDate > endDate) {
        return response.status(400).json({
            message: "Start date cannot be after end date"
        });
    }

    mysql.execute(
        "INSERT INTO elections VALUES (default,?,?,?,?,?,default)",
        [
            user.id,
            title,
            description,
            formatDate(startDate),
            formatDate(endDate)
        ],
        (err, result) => {
            if (err) return response.status(500).json(err);
            return response.status(201).json(result);
        }
    );
}
);

export default router;