import { Router } from "express";
import { isEleitor } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { create } from "../../utils/response.class.mjs";

const router = Router()

router.post("/:candidate_id", isEleitor, (request, response) => {
    const { user } = request;
    const { candidate_id } = request.params;

    mysql.execute(
        "SELECT participation_id FROM candidates WHERE id = ?",
        [candidate_id], (err, result) => {
            if (err) return response.status(500).json(new create(err.message).error())
            if (result.length === 0) return response.status(404).json({ found: false, message: "election not found!" })

            const [{ participation_id }] = result;

            mysql.execute(
                "SELECT election_id FROM participation WHERE id = ?",
                [participation_id], (err, result) => {
                    if (err) return response.status(500).json(new create(err.message).error())
                    if (result.length === 0) return response.status(404).json(new create().not("vote"))

                    const [{ election_id }] = result;

                    mysql.execute(
                        "SELECT id FROM participation WHERE user_id = ? AND election_id = ?",
                        [user.id, election_id], (err, result) => {
                            if (err) return response.status(500).json(new create(err.message).error())
                            if (result.length === 0) return response.status(404).json(new create().not("vote"))

                            const [{ id }] = result;

                            mysql.execute(
                                "INSERT INTO vote VALUES (default,?,?,default)",
                                [id, candidate_id], (err, result) => {
                                    if (err) return response.status(500).json(new create(err.message).error())
                                    if (result.length === 0) return response.status(404).json(new create().not("vote"))

                                    return response.status(200).json(new create(null, result.insertId).ok("vote"))
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