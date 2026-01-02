import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";

const router = Router()

router.get("/", (request, response) => {
    const { user } = request;

    mysql.execute("select * from elections where user_id = ?", [user.id], (err, result) => {
        if (err) return response.status(500).json(err)
        return response.status(200).json(result)
    })
})

export default router;