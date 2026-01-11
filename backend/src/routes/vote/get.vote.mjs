import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { joinedArray } from "../../utils/functions.mjs";

const router = Router()

router.get("/:election_id", (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    mysql.execute(
        "SELECT id FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(200).json({ found: false, message: "election not found!" })

            const themeIDs = joinedArray(result)

            mysql.execute(
                "SELECT id FROM elections WHERE id = ? AND theme_id IN(?)",
                [election_id, themeIDs], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(200).json({ found: false, message: "This is not your election!" })

                    const [{ id }] = result;

                    mysql.execute(
                        "SELECT id FROM participation WHERE election_id = ?",
                        [id], (err, result) => {
                            if (err) return response.status(500).json(err)
                            if (result.length === 0) return response.status(200).json({ found: false, message: "This is not your election!" })

                            const participationIDs = joinedArray(result)

                            mysql.execute(
                                "SELECT * FROM vote WHERE participation_id IN(?)",
                                [participationIDs], (err, result) => {
                                    if (err) return response.status(500).json(err)
                                    if (result.length === 0) return response.status(200).json({ found: false, message: "This is not your election!" })

                                    return response.status(200).json(result)
                                }
                            )
                        }
                    )
                }
            )
        }
    )


})

export default router;