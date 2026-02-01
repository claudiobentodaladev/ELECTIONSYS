import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { authResponse } from "../../utils/response.class.mjs";

const router = Router();

router.get("/", (request, response) => {
    const { user } = request;

    mysql.execute(
        "SELECT id,email,role FROM users WHERE id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(
                new authResponse(err.message).error()
            )
            if (result.length === 0) return response.status(200)

            const [{ id, role }] = result;

            return response.status(200).json(
                new authResponse("user is authenticated!").ok({ id, role })
            )
        }
    )
})

export default router;