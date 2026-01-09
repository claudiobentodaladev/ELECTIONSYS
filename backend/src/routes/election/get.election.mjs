import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";

const router = Router()

router.get("/my/:theme_id", (request, response) => {
    const { user } = request;
    const { theme_id } = request.params;

    mysql.execute(
        "SELECT * FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(200).json({ found: false, message: "election not found!" })

            const [{ id }] = result;

            if (id !== Number(theme_id)) return response.status(404).json({ found: false, message: "election not found!!!" })

            mysql.execute(
                "SELECT * FROM elections WHERE theme_id = ?",
                [id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(404).json({ found: false, message: "There's no election!" })

                    return response.status(200).json(result)
                }
            )
        }
    )

})

export default router;