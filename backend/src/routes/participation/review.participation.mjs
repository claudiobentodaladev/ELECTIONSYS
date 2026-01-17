import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { review } from "../../utils/response.class.mjs";

const router = Router();

router.patch("/:election_id/:participation_id", isAdmin, (request, response) => {
    const { election_id, participation_id } = request.params;
    const { user } = request;
    const { status_participation } = request.body;

    if (!status_participation) return response.status(400).json(
        new review("status_participation must be filled").not()
    )

    if (!["eligible", "ineligible", "blocked"].includes(status_participation)) return response.status(400).json(
        new review("status_participation must be eligible or ineligible or blocked or voted").not()
    )

    const notReview_response = new review().not("participate")

    mysql.execute(
        "SELECT * FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(
                new review(err.message).error()
            )
            if (result.length === 0) return response.status(200).json(notReview_response)

            const [{ id }] = result;

            mysql.execute("select * from elections where id = ? and theme_id = ?", [election_id, id], (err, result) => {
                if (err) return response.status(500).json(
                    new review(err.message).error()
                )
                if (result.length === 0) return response.status(500).json(notReview_response)

                mysql.execute("SELECT status FROM participation WHERE id = ?", [participation_id], (err, result) => {
                    if (err) return response.status(500).json(
                        new review(err.message).error()
                    )
                    if (result.length === 0) return response.status(500).json(notReview_response)

                    const [{ status }] = result;

                    if (status === "voted") return response.status(400).json(
                        new review("not reviewed the participation, because the participate already voted").not()
                    )

                    mysql.execute("UPDATE participation SET status = ? WHERE id = ?", [status_participation, participation_id], (err, result) => {
                        if (err) return response.status(500).json(
                            new review(err.message).error()
                        )

                        return response.status(200).json(
                            new review().ok("participation")
                        )
                    })
                })
            })

        }
    )
});

export default router;