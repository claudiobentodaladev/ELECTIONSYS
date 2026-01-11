import { Router } from "express";
import { isAdmin } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { create } from "../../utils/response.class.mjs";

const router = Router()

router.post("/", isAdmin, (request, response) => {
    const { user } = request;
    const { photo_election_url, name, description } = request.body;

    mysql.execute("INSERT INTO theme VALUES (default,?,?,?,?)",
        [user.id, photo_election_url, name, description], (err, result) => {
            if (err) return response.status(500).json(new create(err.message).error())
            if (result.affectedRows === 0) return response.status(500).json(new create().not("theme")) // replace to another endpoint

            return response.status(201).json(new create(null,result.insertId).ok("theme"))
        }
    )
});

export default router;