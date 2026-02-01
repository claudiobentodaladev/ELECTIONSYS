import { Router } from "express";
import { isEleitor } from "../../../../middleware/role.middleware.mjs";
import mysql from "../../../../database/mysql/db.connection.mjs";
import { apiResponse } from "../../../../utils/response.class.mjs";

const router = Router();

router.post("/:candidates_propose_id", isEleitor, (request, response) => {
    const { user } = request;
    const { candidates_propose_id } = request.params;
    const { rating, comentary } = request.body;

    mysql.execute(
        "SELECT candidate_id FROM candidates_propose WHERE id = ?",
        [candidates_propose_id], (err, result) => {
            if (err) return response.status(500).json(
                new apiResponse(err.message || "Database error", request).error(err)
            )
            if (result.length === 0) return response.status(404).json(
                new apiResponse("Candidate propose not found", request).error({ created: false, message: "not found!" })
            )

            const [{ candidate_id }] = result;

            mysql.execute(
                "SELECT participation_id FROM candidates WHERE id = ?",
                [candidate_id], (err, result) => {
                    if (err) return response.status(500).json(
                        new apiResponse(err.message || "Database error", request).error(err)
                    )
                    if (result.length === 0) return response.status(404).json(
                        new apiResponse("Candidate not found", request).error({ created: false, message: "not found!" })
                    )

                    const [{ participation_id }] = result;

                    mysql.execute(
                        "SELECT election_id FROM participation WHERE id = ?",
                        [participation_id], (err, result) => {
                            if (err) return response.status(500).json(
                                new apiResponse(err.message || "Database error", request).error(err)
                            )
                            if (result.length === 0) return response.status(404).json(
                                new apiResponse("Participation not found", request).error({ created: false, message: "not found!" })
                            )
                            mysql.execute(
                                "SELECT id FROM participation WHERE user_id = ? AND election_id = ?",
                                [user.id, election_id], (err, result) => {
                                    if (err) return response.status(500).json(
                                        new apiResponse(err.message || "Database error", request).error(err)
                                    )
                                    if (result.length === 0) return response.status(404).json(
                                        new apiResponse("User participation not found", request).error({ created: false, message: "not found!" })
                                    )
                                    mysql.execute(
                                        "INSERT INTO propose_comentary VALUES (default,?,?,?,?)",
                                        [id, candidates_propose_id, rating, comentary], (err, result) => {
                                            if (err) return response.status(500).json(
                                                new apiResponse(err.message || "Database error", request).error(err)
                                            )
                                            if (result.length === 0) return response.status(404).json(
                                                new apiResponse("Insert failed", request).error({ created: false, message: "not found!" })
                                            )

                                            return response.status(201).json(
                                                new apiResponse("Comentary created", request).ok({ created: true, message: "comentary created!", propose_comentary_id: result.insertId })
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