import { Router } from "express";
import { isAdmin } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";

const router = Router()

router.post("/", isAdmin, (request, response) => {
    const { user } = request;
    const { photo_election_url, name, description } = request.body;

    mysql.execute("INSERT INTO theme VALUES (default,?,?,?,?)",
        [user.id, photo_election_url, name, description], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.affectedRows === 0) return response.status(500).json({ message: "election not found!" })

            return response.status(201).json({ created: true, message: "theme created", theme_id: result.insertId })
        }
    )
});

export default router;