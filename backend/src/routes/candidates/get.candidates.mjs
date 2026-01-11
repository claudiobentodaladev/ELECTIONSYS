import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isAdmin, isEleitor } from "../../utils/middlewares.mjs";
import { joinedArray } from "../../utils/functions.mjs";
import { found } from "../../utils/responseStructure.mjs";

const router = Router()

router.get("/:election_id", isEleitor, (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    mysql.execute(
        "SELECT id FROM elections WHERE id = ?",
        [election_id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

            mysql.execute("SELECT id FROM participation WHERE user_id = ? AND election_id = ?", [user.id, election_id], (err, result) => {
                if (err) return response.status(500).json(err)
                if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

                mysql.execute(
                    "SELECT id FROM elections WHERE id = ?",
                    [election_id], (err, result) => {
                        if (err) return response.status(500).json(err)
                        if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

                        const [{ id }] = result;

                        mysql.execute("SELECT id FROM participation WHERE election_id = ?", [id], (err, result) => {
                            if (err) return response.status(500).json(err)
                            if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

                            const participations_ids = joinedArray(result)

                            mysql.execute("SELECT * FROM candidates WHERE participation_id IN(?)", [participations_ids], (err, result) => {
                                if (err) return response.status(500).json(err)
                                return response.status(200).json(result)
                            })
                        })

                    }
                )
            })

        }
    )
})

router.get("/:election_id", isAdmin, (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    mysql.execute(
        "SELECT id FROM elections WHERE id = ? AND user_id = ?",
        [election_id, user.id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

            const [{ id }] = result;

            mysql.execute("SELECT id FROM participation WHERE election_id = ?", [id], (err, result) => {
                if (err) return response.status(500).json(err)
                if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

                const participations_ids = joinedArray(result)

                mysql.execute(`SELECT * FROM candidates WHERE participation_id IN(?)`, [participations_ids], (err, result) => {
                    if (err) return response.status(500).json(err)
                    return response.status(200).json(result)
                })
            })

        }
    )
})

export default router;