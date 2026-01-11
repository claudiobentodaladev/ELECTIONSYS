import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { found } from "../../utils/response.class.mjs";

const router = Router()

router.get("/:theme_id", (request, response) => {
    const { user } = request;
    const { theme_id } = request.params;
    const { election_id } = request.query;

    switch (user.role) {
        case "admin":
            mysql.execute(
                "SELECT id FROM theme WHERE user_id = ? AND id = ?",
                [user.id, theme_id], (err, result) => {
                    if (err) return response.status(500).json(new found(err.message).error())
                    if (result.length === 0) return response.status(200).json({ found: false, message: "election not found!" })

                    const [{ id }] = result;

                    // SAME <-
                    if (election_id) {
                        mysql.execute(
                            "SELECT * FROM elections WHERE id = ? AND theme_id = ?",
                            [election_id, id], (err, result) => {
                                if (err) return response.status(500).json(err)
                                if (result.length === 0) return response.status(404).json({ found: false, message: "There's no election!" })

                                const [Result] = result

                                return response.status(200).json(Result)
                            }
                        )
                    } else {
                        mysql.execute(
                            "SELECT * FROM elections WHERE theme_id = ?",
                            [id], (err, result) => {
                                if (err) return response.status(500).json(err)
                                if (result.length === 0) return response.status(404).json({ found: false, message: "There's no election!" })

                                return response.status(200).json(result)
                            }
                        )
                    }
                }
            )
            break;

        case "eleitor":
            mysql.execute(
                "SELECT id FROM theme WHERE id = ?",
                [theme_id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(200).json({ found: false, message: "election not found!" })

                    const [{ id }] = result;

                    // SAME <-
                    if (election_id) {
                        mysql.execute(
                            "SELECT * FROM elections WHERE id = ? AND theme_id = ?",
                            [election_id, id], (err, result) => {
                                if (err) return response.status(500).json(err)
                                if (result.length === 0) return response.status(404).json({ found: false, message: "There's no election!" })

                                const [Result] = result

                                return response.status(200).json(Result)
                            }
                        )
                    } else {
                        mysql.execute(
                            "SELECT * FROM elections WHERE theme_id = ?",
                            [id], (err, result) => {
                                if (err) return response.status(500).json(err)
                                if (result.length === 0) return response.status(404).json({ found: false, message: "There's no election!" })

                                return response.status(200).json(result)
                            }
                        )
                    }
                }
            )
            break;

        default:
            break;
    }

})

export default router;