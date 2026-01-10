import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";

const router = Router()

router.post("/:candidate_id", (request, response) => {
    const { user } = request;
    const { candidate_id } = request.params;

    mysql.execute(
        "SELECT participation_id FROM candidates WHERE id = ?",
        [candidate_id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(200).json({ found: false, message: "election not found!" })

            const [{ participation_id }] = result;

            mysql.execute(
                "SELECT election_id FROM participation WHERE id = ?",
                [participation_id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(200).json({ found: false, message: "election not found!" })

                    const [{ election_id }] = result;

                    mysql.execute(
                        "SELECT id FROM participation WHERE user_id = ? AND election_id = ?",
                        [user.id, election_id], (err, result) => {
                            if (err) return response.status(500).json(err)
                            if (result.length === 0) return response.status(200).json({ found: false, message: "election not found!" })

                            const [{ id }] = result;

                            mysql.execute(
                                "INSERT INTO vote VALUES (default,?,?,default)",
                                [id, candidate_id], (err, result) => {
                                    if (err) return response.status(500).json(err)
                                    if (result.length === 0) return response.status(200).json({ found: false, message: "election not found!" })

                                    return response.status(200).json({ voted: true, message: "voted created" })
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