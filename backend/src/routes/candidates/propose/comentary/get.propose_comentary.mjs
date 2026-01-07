import { Router } from "express";
import mysql from "../../../../database/mysql/db.connection.mjs";

const router = Router();

router.get("/:candidates_propose_id", (request, response) => {
    const { user } = request;
    const { candidates_propose_id } = request.params;

    mysql.execute(
        "SELECT candidate_id FROM candidates_propose WHERE id = ?",
        [candidates_propose_id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

            const [{ candidate_id }] = result;

            mysql.execute(
                "SELECT participation_id FROM candidates WHERE id = ?",
                [candidate_id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

                    const [{ participation_id }] = result;

                    mysql.execute(
                        "SELECT election_id FROM participation WHERE id = ?",
                        [participation_id], (err, result) => {
                            if (err) return response.status(500).json(err)
                            if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

                            const [{ election_id }] = result;

                            mysql.execute(
                                "SELECT id FROM participation WHERE user_id = ? AND election_id = ?",
                                [user.id, election_id], (err, result) => {
                                    if (err) return response.status(500).json(err)
                                    if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

                                    mysql.execute(
                                        "SELECT * FROM propose_comentary WHERE candidates_propose_id = ?",
                                        [candidates_propose_id], (err, result) => {
                                            if (err) return response.status(500).json(err)
                                            if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

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

})

router.get("/my/:candidates_propose_id", (request, response) => {
    const { user } = request;
    const { candidates_propose_id } = request.params;

    mysql.execute(
        "SELECT candidate_id FROM candidates_propose WHERE id = ?",
        [candidates_propose_id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

            const [{ candidate_id }] = result;

            mysql.execute(
                "SELECT participation_id FROM candidates WHERE id = ?",
                [candidate_id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

                    const [{ participation_id }] = result;

                    mysql.execute(
                        "SELECT election_id FROM participation WHERE id = ?",
                        [participation_id], (err, result) => {
                            if (err) return response.status(500).json(err)
                            if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

                            const [{ election_id }] = result;

                            mysql.execute(
                                "SELECT id FROM participation WHERE user_id = ? AND election_id = ?",
                                [user.id, election_id], (err, result) => {
                                    if (err) return response.status(500).json(err)
                                    if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

                                    const [{ id }] = result;

                                    mysql.execute(
                                        "SELECT * FROM propose_comentary WHERE candidates_propose_id = ? AND participation_id = ?",
                                        [candidates_propose_id, id], (err, result) => {
                                            if (err) return response.status(500).json(err)
                                            if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

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

})

export default router;