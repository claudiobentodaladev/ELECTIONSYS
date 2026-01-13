import { Router } from "express";
import { isEleitor } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { create } from "../../utils/response.class.mjs";

const router = Router();

router.post("/:election_id", isEleitor, (request, response) => {
    try {
        const { user } = request;
        const { election_id } = request.params;

        mysql.execute("INSERT INTO participation values (default,?,?,default)", [user.id, election_id], (err, result) => {
            if (err) return response.status(500).json(new create("participation").error())

            return response.status(201).json(new create("participation", result.insertId).ok())
        })
    } catch (err) {
        return response.status(500).json(new create("participation").error())
    }
});

export default router;