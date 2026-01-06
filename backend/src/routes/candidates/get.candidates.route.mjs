import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isEleitor } from "../../utils/middlewares.mjs";

const router = Router()

router.get("/", isEleitor, (request, response) => {
    const { user } = request;

    mysql.execute("SELECT * FROM participation WHERE user_id = ?", [user.id], (err, result) => {
        if (err) return response.status(500).json(err)
        if (result.length === 0) return response.status(404).json({ found: false, message: "not found!" })

        let participations_ids = [];
        result.map(({ id }, index) => {
            participations_ids.push(id)
        })

        mysql.execute(
            `SELECT * FROM candidates WHERE participation_id IN(${participations_ids.join(",")})`,
            (err, result) => {
                if (err) return response.status(500).json(err)
                if (result.length === 0) return response.status(404).json({ found: false, message: "not found!", participations_ids: participations_ids.join(",") })

                return response.status(200).json(result)
            })
    })
})

export default router;