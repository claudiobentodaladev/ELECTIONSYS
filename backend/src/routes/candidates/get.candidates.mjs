import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isAdmin, isEleitor } from "../../utils/middlewares.mjs";
import { joinedArray } from "../../utils/functions.mjs";
import { found } from "../../utils/responseStructure.mjs";

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
                    if (result.length === 0) return response.status(404).json(new found("There'no theme created by this user").not())

                    const themeIDs = joinedArray(result)

                    mysql.execute(
                        "SELECT id FROM elections WHERE id = ? AND theme_id IN(?)",
                        [election_id, themeIDs], (err, result) => {
                            if (err) return response.status(500).json(new found(err.message).error())
                            if (result.length === 0) return response.status(404).json(new found("Election not found").not())

                            const [{ id }] = result;

                            mysql.execute("SELECT id FROM participation WHERE election_id = ?", [id], (err, result) => {
                                if (err) return response.status(500).json(err)
                                if (result.length === 0) return response.status(404).json(new found("There's no participation on this election").not())

                                const participations_ids = joinedArray(result)

                                mysql.execute(`SELECT * FROM candidates WHERE participation_id IN(?)`, [participations_ids], (err, result) => {
                                    if (err) return response.status(500).json(new found(err.message).error())
                                    if (result.length === 0) return response.status(404).json(new found("There's no candidation on this election").not())

                                    return response.status(200).json(new found("All the candidates on election",result).ok())
                                })
                            })

                        })
                })
            break;

        case "eleitor":
            mysql.execute(
                "SELECT id FROM participation WHERE user_id = ? AND election_id = ?",
                [user.id, election_id], (err, result) => {
                    if (err) return response.status(500).json(new found(err.message).error())
                    if (result.length === 0) return response.status(404).json(new found("This user is not participating on this election").not())

                    mysql.execute("SELECT id FROM participation WHERE election_id = ?", [election_id], (err, result) => {
                        if (err) return response.status(500).json(new found(err.message).error())
                        if (result.length === 0) return response.status(404).json(new found("There's no participation on this election").not())

                        const participations_ids = joinedArray(result)

                        mysql.execute("SELECT * FROM candidates WHERE participation_id IN(?)", [participations_ids], (err, result) => {
                            if (err) return response.status(500).json(new found(err.message).error())
                            if (result.length === 0) return response.status(404).json(new found("There's no candidation on this election").not())

                            return response.status(200).json(new found("All the candidates on election",result).ok())
                        })
                    })
                })
            break;

        default:
            return response.sendStatus(500)
            break;
    }

})

export default router;