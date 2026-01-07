import { Router } from "express";
import { isEleitor } from "../../../utils/middlewares.mjs";
import mysql from "../../../database/mysql/db.connection.mjs";

const router = Router()

router.post("/:candidate_id", isEleitor, (request, response) => {
    const { candidate_id } = request.params;
    const { user } = request;
    const { title, body } = request.body;

    mysql.execute("SELECT participation_id FROM candidates WHERE id = ?",
        [candidate_id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(404).json({ found: false, message: "not found!" })

            const [{ participation_id }] = result;

            mysql.execute(
                "SELECT * FROM participation WHERE id = ? AND user_id = ?",
                [participation_id, user.id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(404).json({ created: false, message: "not found!" })

                    mysql.execute(
                        "INSERT INTO candidates_propose VALUES (default,?,?,?)",
                        [candidate_id, title, body], (err, result) => {
                            if (err) return response.status(500).json(err)
                            if (result.length === 0) return response.status(404).json({ created: false, message: "not found!" })

                            return response.status(201).json({ created: true, candidates_propose_id: result.insertId })
                        }
                    )
                }
            )
        }
    )
})

export default router;