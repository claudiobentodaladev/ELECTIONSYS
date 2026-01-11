import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { joinedArray } from "../../utils/functions.mjs";
import { found } from "../../utils/response.class.mjs";

const router = Router()

router.get("/:election_id", (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    switch (user.role) {
        case "admin":
            mysql.execute(
                "SELECT id FROM theme WHERE user_id = ?",
                [user.id], (err, result) => {
                    if (err) return response.status(500).json(new found(err.message).error())
                    if (result.length === 0) return response.status(200).json(new found("There's no theme created by this user").not())

                    const themeIDs = joinedArray(result)

                    mysql.execute(
                        "SELECT id FROM elections WHERE id = ? AND theme_id IN(?)",
                        [election_id, themeIDs], (err, result) => {
                            if (err) return response.status(500).json(new found(err.message).error())
                            if (result.length === 0) return response.status(200).json(new found().not("vote"))

                            const [{ id }] = result;

                            mysql.execute(
                                "SELECT id FROM participation WHERE election_id = ?",
                                [id], (err, result) => {
                                    if (err) return response.status(500).json(new found(err.message).error())
                                    if (result.length === 0) return response.status(200).json(new found().not("vote"))

                                    const participationIDs = joinedArray(result)

                                    mysql.execute(
                                        "SELECT * FROM vote WHERE participation_id IN(?)",
                                        [participationIDs], (err, result) => {
                                            if (err) return response.status(500).json(new found(err.message).error())
                                            if (result.length === 0) return response.status(200).json(new found().not("vote"))

                                            return response.status(200).json(new found(null,result).ok("vote"))
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            )
            break;

        case "eleitor":
            mysql.execute(
                "SELECT id FROM participation WHERE user_id = ? AND election_id = ?",
                [user.id, election_id], (err, result) => {
                    if (err) return response.status(500).json(new found(err.message).error())
                    if (result.length === 0) return response.status(200).json(new found().not("vote"))

                    const [{ id }] = result;

                    mysql.execute(
                        "SELECT * FROM vote WHERE participation_id = ?",
                        [id], (err, result) => {
                            if (err) return response.status(500).json(new found(err.message).error())
                            if (result.length === 0) return response.status(200).json(new found().not("vote"))

                            return response.status(200).json(new found(null,result).ok("vote"))
                        }
                    )

                }
            )
            break;

        default:
            break;
    }

})

export default router;