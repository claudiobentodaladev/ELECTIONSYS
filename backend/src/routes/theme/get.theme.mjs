import { Router } from "express";
import { isAdmin, isEleitor } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";

const router = Router()

router.get("/my", isAdmin, (request, response) => {
    const { user } = request;

    mysql.execute(
        "SELECT * FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(200).json(result)

            return response.status(200).json(result)
        }
    )
});

router.get("/", isEleitor, (request, response) => {
    mysql.execute(
        "SELECT * FROM theme", (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(200).json(result)

            return response.status(200).json(result)
        }
    )
});

export default router;