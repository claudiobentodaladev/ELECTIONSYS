import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { review } from "../../utils/response.class.mjs";

const router = Router()

router.patch("/:candidate_id", isAdmin, (request, response) => {
    const { user } = request;
    const { candidate_id } = request.params;

    const notReviewedResponse = new review("There's no candidate to review").not()

    mysql.execute(
        "SELECT participation_id FROM candidates WHERE id = ?",
        [candidate_id], (err, result) => {
            if (err) return response.status(500).json(new review(err.message).error())
            if (result.length === 0) return response.status(404).json(notReviewedResponse)

            const [{ participation_id }] = result;

            mysql.execute(
                "SELECT election_id FROM participation WHERE id = ?",
                [participation_id], (err, result) => {
                    if (err) return response.status(500).json(new review(err.message).error())
                    if (result.length === 0) return response.status(404).json(notReviewedResponse)

                    const [{ election_id }] = result;

                    mysql.execute(
                        "SELECT * FROM elections WHERE id = ?",
                        [election_id], (err, result) => {
                            if (err) return response.status(500).json(new review(err.message).error())
                            if (result.length === 0) return response.status(404).json(notReviewedResponse)

                            const [{ theme_id }] = result;

                            mysql.execute(
                                "SELECT * FROM theme WHERE id = ? AND user_id = ?",
                                [theme_id, user.id], (err, result) => {
                                    if (err) return response.status(500).json(new review(err.message).error())
                                    if (result.length === 0) return response.status(404).json(notReviewedResponse)

                                    mysql.execute(
                                        "SELECT * FROM candidates WHERE id = ?",
                                        [candidate_id], (err, result) => {
                                            if (err) return response.status(500).json(new review(err.message).error())
                                            if (result.length === 0) return response.status(404).json(notReviewedResponse)

                                            const [{ status }] = result;

                                            const toggleStatus = (value) => {
                                                if (value == "ineligible") return "eligible"
                                                else return "ineligible"
                                            }

                                            mysql.execute(
                                                "UPDATE candidates SET status = ? LIMIT 1",
                                                [toggleStatus(status)], (err, result) => {
                                                    if (err) return response.status(500).json(new review(err.message).error())

                                                    return response.status(200).json(new review().ok("candadidate"))
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