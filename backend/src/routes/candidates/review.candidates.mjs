import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isAdmin } from "../../utils/middlewares.mjs";

const router = Router()

router.patch("/:candidate_id", isAdmin, (request, response) => {
    const { user } = request;
    const { candidate_id } = request.params;
    //GOOD WAY TO VALIDATE ACTION IN ELECTION
    mysql.execute(
        "SELECT participation_id FROM candidates WHERE id = ?",
        [candidate_id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

            const [{ participation_id }] = result;

            mysql.execute(
                "SELECT * FROM participation WHERE id = ?",
                [participation_id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

                    const [{ election_id }] = result;

                    mysql.execute(
                        "SELECT * FROM elections WHERE id = ?",
                        [election_id], (err, result) => {
                            if (err) return response.status(500).json(err)
                            if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

                            const [{ theme_id }] = result;

                            mysql.execute(
                                "SELECT * FROM theme WHERE id = ? AND user_id = ?",
                                [theme_id, user.id], (err, result) => {
                                    if (err) return response.status(500).json(err)
                                    if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

                                    mysql.execute(
                                        "SELECT * FROM candidates WHERE id = ?",
                                        [candidate_id], (err, result) => {
                                            if (err) return response.status(500).json(err)
                                            if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

                                            const [{ status }] = result;

                                            const toggleStatus = (value) => {
                                                if (value == "ineligible") return "eligible"
                                                else return "ineligible"
                                            }

                                            mysql.execute(
                                                "UPDATE candidates SET status = ? LIMIT 1",
                                                [toggleStatus(status)], (err, result) => {
                                                    if (err) return response.status(500).json(err)

                                                    return response.status(200).json(result)

                                                }
                                            )
                                        }
                                    )
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