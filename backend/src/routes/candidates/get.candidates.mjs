import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { joinedArray } from "../../utils/functions.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router()

router.get("/:election_id", (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    switch (user.role) {
        case "admin":
            mysql.execute(
                "SELECT id FROM theme WHERE user_id = ?",
                [user.id], (err, result) => {
                    if (err) return response.status(500).json(
                        new apiResponse(err.message).error(true)
                    )
                    if (result.length === 0) return response.status(404).json(
                        new apiResponse("There'no theme created by this user").error(true)
                    )

                    const themeIDs = joinedArray(result)

                    mysql.execute(
                        "SELECT id FROM elections WHERE id = ? AND theme_id IN(?)",
                        [election_id, themeIDs], (err, result) => {
                            if (err) return response.status(500).json(
                                new apiResponse(err.message).error(true)
                            )
                            if (result.length === 0) return response.status(404).json(
                                new apiResponse("Election not found").error(true)
                            )

                            const [{ id }] = result;

                            mysql.execute("SELECT id FROM participation WHERE election_id = ?", [id], (err, result) => {
                                if (err) return response.status(500).json(err)
                                if (result.length === 0) return response.status(404).json(
                                    new apiResponse("There's no participation on this election").error(true)
                                )

                                const participations_ids = joinedArray(result)

                                mysql.execute(`SELECT * FROM candidates WHERE participation_id IN(?)`, [participations_ids], (err, result) => {
                                    if (err) return response.status(500).json(
                                        new apiResponse(err.message).error(true)
                                    )
                                    if (result.length === 0) return response.status(404).json(
                                        new apiResponse("There's no candidation on this election").error(true)
                                    )

                                    return response.status(200).json(
                                        new apiResponse("All the candidates on election").ok(result)
                                    )
                                })
                            })

                        })
                })
            break;

        case "eleitor":
            mysql.execute(
                "SELECT id FROM participation WHERE user_id = ? AND election_id = ?",
                [user.id, election_id], (err, result) => {
                    if (err) return response.status(500).json(
                        new apiResponse(err.message).error(true)
                    )
                    if (result.length === 0) return response.status(404).json(
                        new apiResponse("This user is not participating on this election").error(true)
                    )

                    mysql.execute("SELECT id FROM participation WHERE election_id = ?", [election_id], (err, result) => {
                        if (err) return response.status(500).json(
                            new apiResponse(err.message).error(true)
                        )
                        if (result.length === 0) return response.status(404).json(
                            new apiResponse("There's no participation on this election").error(true)
                        )

                        const participations_ids = joinedArray(result)

                        mysql.execute("SELECT * FROM candidates WHERE participation_id IN(?)", [participations_ids], (err, result) => {
                            if (err) return response.status(500).json(
                                new apiResponse(err.message).error(true)
                            )
                            if (result.length === 0) return response.status(404).json(
                                new apiResponse("There's no candidation on this election").error(true)
                            )

                            return response.status(200).json(
                                new apiResponse("All the candidates on election").ok(result)
                            )
                        })
                    })
                })
            break;

        default:
            return response.status(500).json(
                new apiResponse("Invalid role").error(true)
            )
            break;
    }

})

export default router;