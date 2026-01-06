import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isAdmin, isEleitor } from "../../utils/middlewares.mjs";
import { joinedArray } from "../../utils/functions.mjs";

const router = Router()

router.get("/", isEleitor, (request, response) => {
    const { user } = request;

    mysql.execute("SELECT * FROM participation WHERE user_id = ?", [user.id], (err, result) => {
        if (err) return response.status(500).json(err)
        if (result.length === 0) return response.status(404).json({ found: false, message: "not found!" })

        const participations_ids = joinedArray(result)

        mysql.execute(
            `SELECT * FROM candidates WHERE participation_id IN(${participations_ids})`,
            (err, result) => {
                if (err) return response.status(500).json(err)
                if (result.length === 0) return response.status(404).json({ found: false, message: "not found!", participations_ids: participations_ids.join(",") })

                return response.status(200).json(result)
            })
    })
})

router.get("/:election_id", isAdmin, (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    mysql.execute("SELECT id FROM participation WHERE election_id = ?", [election_id], (err, result) => {
        if (err) return response.status(500).json(err)
        if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

        const participations_ids = joinedArray(result)

        mysql.execute(`SELECT * FROM candidates WHERE participation_id IN(?)`, [participations_ids], (err, result) => {
            if (err) return response.status(500).json(err)
            return response.status(200).json(result)
        })
    })

})

export default router;