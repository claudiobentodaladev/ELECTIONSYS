import { Router } from "express";
import { isAdmin, isEleitor } from "../../middleware/role.middleware.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router()

router.get("/", isAdmin, (request, response) => {
    const { user } = request;

    mysql.execute(
        "SELECT * FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(
                new apiResponse(err.message).error(err)
            )
            if (result.length === 0) return response.status(200).json(
                new apiResponse("There'no theme created by this user").error(true)
            )

            return response.status(200).json(
                new apiResponse("all the theme created by this user").ok(result)
            )
        }
    )
});

export default router;