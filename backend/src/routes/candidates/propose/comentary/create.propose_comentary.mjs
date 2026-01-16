import { Router } from "express";
import { isEleitor } from "../../../../middleware/role.middleware.mjs";
import mysql from "../../../../database/mysql/db.connection.mjs";

const router = Router();

router.post("/:candidates_propose_id", isEleitor, (request, response) => {
    const { user } = request;
    const { candidates_propose_id } = request.params;
    const { rating, comentary } = request.body;

    mysql.execute(
        "SELECT candidate_id FROM candidates_propose WHERE id = ?",
        [candidates_propose_id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(404).json({ created: false, message: "not found!" })

            const [{ candidate_id }] = result;

            mysql.execute(
                "SELECT participation_id FROM candidates WHERE id = ?",
                [candidate_id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(404).json({ created: false, message: "not found!" })

                    const [{ participation_id }] = result;

                    mysql.execute(
                        "SELECT election_id FROM participation WHERE id = ?",
                        [participation_id], (err, result) => {
                            if (err) return response.status(500).json(err)
                            if (result.length === 0) return response.status(404).json({ created: false, message: "not found!" })

                            const [{ election_id }] = result;

                            mysql.execute(
                                "SELECT id FROM participation WHERE user_id = ? AND election_id = ?",
                                [user.id, election_id], (err, result) => {
                                    if (err) return response.status(500).json(err)
                                    if (result.length === 0) return response.status(404).json({ created: false, message: "not found!" })

                                    const [{ id }] = result;

                                    mysql.execute(
                                        "INSERT INTO propose_comentary VALUES (default,?,?,?,?)",
                                        [id, candidates_propose_id, rating, comentary], (err, result) => {
                                            if (err) return response.status(500).json(err)
                                            if (result.length === 0) return response.status(404).json({ created: false, message: "not found!" })

                                            return response.status(201).json({ created: true, message: "comentary created!", propose_comentary_id: result.insertId })
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