import { Router } from "express";
import { isEleitor } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";

const router = Router();

router.post("/:election_id", isEleitor, (request, response) => {
    try {
        const { user } = request;
        const { election_id } = request.params;

        mysql.execute("INSERT INTO participation values (default,?,?,default)", [user.id, election_id], (err, result) => {
            if (err) return response.status(500).json({ message: "run into a problem", created: false, error: err.message })

            return response.status(201).json({ message: "participation created", created: true, participation_id: result.insertId })
        })
    } catch (err) {
        return response.status(500).json({ message: "participation not created", created: false, error: err.message })
    }
});

export default router;