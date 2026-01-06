import { Router } from "express";
import { isEleitor } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";

const router = Router()

// to get propose as a normal eleitor
router.get("/:candidate_id", isEleitor, (request, response) => {
    const { user } = request;
    const { candidate_id } = request.params;

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

                    const electionId = result[0].election_id;

                    mysql.execute("SELECT election_id FROM participation WHERE user_id = ?", [user.id], (err, result) => {
                        if (err) return response.status(500).json(err)
                        if (result.length === 0) return response.status(404).json({ found: false, message: "not found!" })

                        const aqual = []
                        result.map(({ election_id }) => {
                            aqual.push(election_id)
                        })

                        if (!aqual.includes(electionId)) {
                            return response.status(404).json({ found: false, message: "You aren't participating on this  election, to get the propose!" })
                        }

                        mysql.execute(
                            "SELECT * FROM candidates_propose WHERE candidate_id = ?",
                            [candidate_id], (err, result) => {
                                if (err) return response.status(500).json(err)
                                if (result.length === 0) return response.status(404).json({ found: false, message: "candidate not found!" })

                                return response.status(200).json(result)
                            }
                        )
                    })
                }
            )
        }
    )
})

router.get("/:election_id", isEleitor, (request, response) => {
    // to get propose as a candidate
})

export default router;