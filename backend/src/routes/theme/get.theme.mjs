import { Router } from "express";
import { isAdmin, isEleitor } from "../../middleware/role.middleware.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { found } from "../../utils/response.class.mjs";

const router = Router()

router.get("/", isAdmin, (request, response) => {
    const { user } = request;

    mysql.execute(
        "SELECT * FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(new found(err.message).error())
            if (result.length === 0) return response.status(200).json(new found("There'no theme created by this user").not())

            return response.status(200).json(new found(null, result).ok("all theme"))
        }
    )
});

export default router;