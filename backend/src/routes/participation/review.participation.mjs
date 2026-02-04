import { Router } from "express";
import mysql from "../../config/database/mysql/db.connection.mjs";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router();

router.patch("/:participation_id/election/:election_id", isAdmin, (request, response) => {
    const { participation_id, election_id } = request.params;
    const { user } = request;
    const { status_participation } = request.body;

    // after put in custom validator ==========================================================================
    if (!status_participation) return response.status(400).json(
        new apiResponse("status_participation must be filled").error(true)
    )
    if (!["eligible", "ineligible", "blocked"].includes(status_participation)) return response.status(400).json(
        new apiResponse("status_participation must be eligible or ineligible or blocked or voted").error(true)
    )
    // =============================  after put in custom validator ============================================
    const notReview_response = new apiResponse("not review the participation").error(true)

    mysql.execute(
        "SELECT * FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(
                new apiResponse(err.message).error(err)
            )
            if (result.length === 0) return response.status(200).json(notReview_response)

            const [{ id }] = result;

            mysql.execute("select * from elections where id = ? and theme_id = ?", [election_id, id], (err, result) => {
                if (err) return response.status(500).json(
                    new apiResponse(err.message).error(err)
                )
                if (result.length === 0) return response.status(500).json(notReview_response)

                mysql.execute("SELECT status FROM participation WHERE id = ?", [participation_id], (err, result) => {
                    if (err) return response.status(500).json(
                        new apiResponse(err.message).error(err)
                    )
                    if (result.length === 0) return response.status(500).json(notReview_response)

                    const [{ status }] = result;

                    if (status === "voted") return response.status(400).json(
                        new apiResponse("not reviewed the participation, because the participate already voted").error(true)
                    )

                    mysql.execute("UPDATE participation SET status = ? WHERE id = ?", [status_participation, participation_id], (err, result) => {
                        if (err) return response.status(500).json(
                            new apiResponse(err.message).error(err)
                        )

                        return response.status(200).json(
                            new apiResponse("review the participation").ok({ participation_id, election_id })
                        )
                    })
                })
            })

        }
    )
});

export default router;