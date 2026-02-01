import { Router } from "express";
import { isEleitor } from "../../../middleware/role.middleware.mjs";
import mysql from "../../../database/mysql/db.connection.mjs";
import { apiResponse } from "../../../utils/response.class.mjs";

const router = Router()

router.post("/:candidate_id", isEleitor, (request, response) => {
    const { candidate_id } = request.params;
    const { user } = request;
    const { title, body } = request.body;

    mysql.execute("SELECT participation_id FROM candidates WHERE id = ?",
        [candidate_id], (err, result) => {
            if (err) return response.status(500).json(
                new apiResponse("Database error", request).error(err)
            )
            if (result.length === 0) return response.status(404).json(
                new apiResponse("Candidate not found", request).error({ found: false, message: "not found!" }))

            const [{ participation_id }] = result;

            mysql.execute(
                "SELECT * FROM participation WHERE id = ? AND user_id = ?",
                [participation_id, user.id], (err, result) => {
                    if (err) return response.status(500).json(
                        new apiResponse("Database error", request).error(err)
                    )
                    if (result.length === 0) return response.status(404).json(
                        new apiResponse("Participation not found", request).error({ created: false, message: "not found!" })
                    )

                    mysql.execute(
                        "INSERT INTO candidates_propose VALUES (default,?,?,?)",
                        [candidate_id, title, body], (err, result) => {
                            if (err) return response.status(500).json(
                                new apiResponse("Database error", request).error(err)
                            )
                            if (result.length === 0) return response.status(404).json(
                                new apiResponse("Insert failed", request).error({ created: false, message: "not found!" })
                            )

                            return response.status(201).json(
                                new apiResponse("Candidate propose created", request).ok({ created: true, candidates_propose_id: result.insertId })
                            )
                        }
                    )
                }
            )
        }
    )
})

export default router;